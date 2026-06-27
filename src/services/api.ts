import type { Match, MatchStatus, GroupStanding, Group, GoalEvent } from '../types'
import TEAMS from '../data/teams'
import { CACHE_DURATION, getCached, setCached } from './cache'

const ESPN_SITE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world'
const ESPN_WEB = 'https://site.web.api.espn.com/apis/v2/scoreboard/header'

// --- Types ---
interface EspnCompetitor {
  id: string; homeAway: string; score: string; winner?: boolean
  team: { abbreviation: string; displayName: string; shortDisplayName: string }
}
interface EspnStatusType { state: string; completed: boolean; detail: string }
interface EspnEvent {
  id: string; date: string; name: string
  season: { year: number; type: number; slug: string }
  competitions: Array<{
    date: string; altGameNote?: string; competitors: EspnCompetitor[]
    status: { displayClock?: string; period?: number; type: EspnStatusType }
    venue?: { fullName: string }
  }>
}

// --- Helpers ---
function mState(s: string, c: boolean): MatchStatus {
  if (s === 'pre') return 'SCHEDULED'
  if (s === 'in') return 'LIVE'
  if (s === 'post') return c ? 'FINISHED' : 'POSTPONED'
  return 'SCHEDULED'
}
function pScore(s: string): number | null {
  if (!s && s !== '0') return null; const n = Number(s); return isNaN(n) ? null : n
}
function pMin(c: string | undefined): number | undefined {
  if (!c) return undefined; const n = parseInt(c.replace(/[+']/g, '').trim(), 10); return isNaN(n) ? undefined : n
}
function sSlug(s: string): Match['stage'] {
  const m: Record<string, Match['stage']> = {
    'group-stage': 'GROUP', 'round-of-32': 'R32', 'knockout-round-of-32': 'R32',
    'round-of-16': 'R16', 'knockout-round-of-16': 'R16',
    'quarterfinals': 'QUARTER', 'knockout-quarterfinal': 'QUARTER',
    'semifinals': 'SEMI', 'knockout-semifinal': 'SEMI',
    '3rd-place-match': 'THIRD_PLACE', 'knockout-third-place': 'THIRD_PLACE',
    'final': 'FINAL', 'knockout-final': 'FINAL',
  }
  return m[s] || 'GROUP'
}
function pGroup(a: string | undefined): string { return a ? ((a.match(/Group ([A-P])/) || [])[1] || '') : '' }
function isTbd(a: string): boolean { return !a || /^\d+[A-Z]*$/.test(a) || /^(rd|qf|sf)\d/i.test(a) }

function parseMatch(e: EspnEvent): Match {
  const comp = e.competitions?.[0]
  if (!comp) return { id: e.id, homeTeamId: '', awayTeamId: '', homeScore: null, awayScore: null, status: 'SCHEDULED', stage: sSlug(e.season.slug), date: e.date, venue: 'TBD' }
  const h = comp.competitors.find(c => c.homeAway === 'home')
  const a = comp.competitors.find(c => c.homeAway === 'away')
  const st = comp.status.type; const s = mState(st.state, st.completed)
  const ha = (h?.team?.abbreviation || '').toLowerCase(), aa = (a?.team?.abbreviation || '').toLowerCase()
  return {
    id: e.id, homeTeamId: isTbd(ha) ? '' : ha, awayTeamId: isTbd(aa) ? '' : aa,
    homeScore: (s === 'SCHEDULED' || s === 'POSTPONED') ? null : pScore(h?.score || ''),
    awayScore: (s === 'SCHEDULED' || s === 'POSTPONED') ? null : pScore(a?.score || ''),
    status: s, stage: sSlug(e.season.slug), groupName: pGroup(comp.altGameNote),
    date: comp.date || e.date, venue: comp.venue?.fullName || 'TBD', minute: pMin(comp.status.displayClock),
  }
}

// --- Team ---
function tn(id: string): string { return TEAMS[id]?.nameVi || TEAMS[id]?.name || id.toUpperCase() }
function tf(id: string): string { return TEAMS[id]?.flag || '⬜' }

// --- Groups ---
export function buildGroups(matches: Match[]): Group[] {
  const m = new Map<string, Set<string>>()
  for (const x of matches) {
    if (x.stage !== 'GROUP' || !x.groupName) continue
    if (!m.has(x.groupName)) m.set(x.groupName, new Set())
    if (x.homeTeamId) m.get(x.groupName)!.add(x.homeTeamId)
    if (x.awayTeamId) m.get(x.groupName)!.add(x.awayTeamId)
  }
  return [...m.entries()].filter(([_,v]) => v.size > 0).map(([n,ids]) => ({
    id: n, name: `Bảng ${n}`,
    teams: [...ids].sort().map(id => {
      const t = TEAMS[id]
      return { id, name: id.toUpperCase(), nameVi: tn(id), flag: tf(id), fifaCode: id.toUpperCase(), iso2: t?.iso2 || id }
    }),
  })).sort((a, b) => a.id.localeCompare(b.id))
}

// --- Standings ---
export function computeGroupStandings(matches: Match[]): Record<string, GroupStanding[]> {
  const gm = new Map<string, Map<string, GroupStanding>>()
  for (const x of matches) {
    if (x.stage !== 'GROUP' || !x.groupName) continue
    if (!gm.has(x.groupName)) gm.set(x.groupName, new Map())
    for (const tid of [x.homeTeamId, x.awayTeamId])
      if (tid && !gm.get(x.groupName)!.has(tid)) gm.get(x.groupName)!.set(tid, { teamId: tid, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })
  }
  for (const x of matches) {
    if (x.status !== 'FINISHED' && x.status !== 'LIVE') continue
    if (x.stage !== 'GROUP' || !x.groupName) continue
    const s = gm.get(x.groupName), h = s?.get(x.homeTeamId), a = s?.get(x.awayTeamId)
    if (!h || !a) continue
    const hs = x.homeScore ?? 0, as = x.awayScore ?? 0
    h.played++; a.played++; h.goalsFor += hs; h.goalsAgainst += as; a.goalsFor += as; a.goalsAgainst += hs
    if (hs > as) { h.won++; h.points += 3; a.lost++ }
    else if (hs < as) { a.won++; a.points += 3; h.lost++ }
    else { h.drawn++; a.drawn++; h.points++; a.points++ }
  }
  const r: Record<string, GroupStanding[]> = {}
  for (const [gid, ss] of gm) r[gid] = [...ss.values()].sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) || b.goalsFor - a.goalsFor)
  return r
}

// --- Date ---
const T0 = new Date('2026-06-11'), T1 = new Date('2026-07-20')
function fDt(d: Date): string { return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}` }
function dr(): string { const t = new Date(); return `${fDt(T0)}-${fDt(new Date(Math.min(t.getTime()+7*86400000,T1.getTime())))}` }

// --- Fetch with match number merge ---
async function fetchMatchNumbers(): Promise<Map<string, number>> {
  const nums = new Map<string, number>()
  // Fetch per-day to get all match numbers
  const today = new Date()
  const end = new Date(Math.min(today.getTime() + 7 * 86400000, T1.getTime()))
  const days: string[] = []
  for (let d = new Date(T0); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(fDt(d))
  }
  // Batch into groups of 3 days to reduce requests
  for (let i = 0; i < days.length; i += 3) {
    const batch = days.slice(i, i + 3)
    try {
      const res = await fetch(`${ESPN_WEB}?sport=soccer&league=fifa.world&dates=${batch[0]}-${batch[batch.length-1]}`)
      if (!res.ok) continue
      const data = await res.json()
      const events = data.sports?.[0]?.leagues?.[0]?.events || []
      for (const e of events) {
        if (e.id && e.matchNumber) nums.set(String(e.id), e.matchNumber)
      }
    } catch { /* skip */ }
  }
  return nums
}

export async function fetchAllMatches(force = false): Promise<Match[]> {
  if (!force) { const c = getCached<Match[]>('all_matches'); if (c) return c }
  try {
    const [r, nums] = await Promise.all([
      fetch(`${ESPN_SITE}/scoreboard?dates=${dr()}`),
      fetchMatchNumbers(),
    ])
    if (!r.ok) throw new Error(`${r.status}`)
    const data = await r.json()
    const matches: Match[] = (data.events || []).map(parseMatch)
    // Merge match numbers
    for (const m of matches) {
      const num = nums.get(m.id)
      if (num) m.matchNumber = num
    }
    setCached('all_matches', matches, CACHE_DURATION.SCORES)
    return matches
  } catch { return [] }
}

export async function fetchTodayMatches(): Promise<Match[]> {
  try {
    const r = await fetch(`${ESPN_SITE}/scoreboard?dates=${fDt(new Date())}`)
    if (!r.ok) throw new Error(`${r.status}`)
    return ((await r.json()).events || []).map(parseMatch)
  } catch { return [] }
}

// --- Knockout sorted by matchNumber ---
export function getKnockoutMatches(matches: Match[]): Record<string, Match[]> {
  const stages = ['R32', 'R16', 'QUARTER', 'SEMI', 'FINAL', 'THIRD_PLACE']
  const r: Record<string, Match[]> = {}
  for (const s of stages) r[s] = []
  for (const m of matches) if (r[m.stage]) r[m.stage].push(m)
  for (const s of stages) {
    r[s].sort((a, b) => {
      const na = a.matchNumber ?? 999, nb = b.matchNumber ?? 999
      return na - nb
    })
  }
  return r
}

// --- Goal scorers from ESPN summary ---
export async function fetchMatchGoals(matchId: string): Promise<GoalEvent[]> {
  const cached = getCached<GoalEvent[]>(`goals_${matchId}`)
  if (cached) return cached

  try {
    const r = await fetch(`${ESPN_SITE}/summary?event=${matchId}`)
    if (!r.ok) return []
    const data = await r.json()

    // Build team ID map: numeric ESPN id → abbreviation (e.g. "203" → "mex")
    const teamMap = new Map<string, string>()
    for (const comp of data.header?.competitions || []) {
      for (const c of comp.competitors || []) {
        const id = c.id
        const abbr = (c.team?.abbreviation || '').toLowerCase()
        if (id && abbr) teamMap.set(id.toString(), abbr)
      }
    }

    // Goals are in keyEvents (top-level array)
    const goals: GoalEvent[] = []
    for (const ev of data.keyEvents || []) {
      if (ev.scoringPlay && ev.type?.type === 'goal') {
        const teamIdNum = ev.team?.id?.toString() || ''
        const teamId = teamMap.get(teamIdNum) || teamIdNum
        const scorerName = ev.participants?.[0]?.athlete?.displayName || 'Không rõ'
        goals.push({
          teamId,
          scorerName,
          minute: ev.clock?.displayValue || '?',
          ownGoal: (ev.text || '').toLowerCase().includes('own goal'),
          penalty: (ev.type?.text || '').toLowerCase().includes('penalty'),
        })
      }
    }

    // Sort earliest first by clock seconds value
    goals.sort((a, b) => {
      const pa = parseInt(a.minute.replace(/[+']/g, ''), 10) || 0
      const pb = parseInt(b.minute.replace(/[+']/g, ''), 10) || 0
      return pa - pb
    })
    setCached(`goals_${matchId}`, goals, CACHE_DURATION.SCORES)
    return goals
  } catch {
    return []
  }
}
