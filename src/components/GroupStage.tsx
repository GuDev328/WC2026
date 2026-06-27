import { memo } from 'react'
import type { Group, GroupStanding, Match, Team } from '../types'
import TEAMS from '../data/teams'
import { flagUrl } from '../utils/flag'
import { formatDateVi } from '../utils/format'
import GoalTooltip from './GoalTooltip'

type FormResult = 'W' | 'D' | 'L'

interface GroupStageProps {
  groups: Group[]
  standings: Record<string, GroupStanding[]>
  groupMatches: Record<string, Match[]>
  teamForms: Record<string, FormResult[]>
  groupProgress: Record<string, number>
  onTeamClick: (team: Team, stats: GroupStanding, matches: Match[]) => void
}

type QualStatus = 'Q' | 'E' | null

function getQualStatus(
  idx: number,
  s: GroupStanding,
  belowIdx: number | null,
  belowStanding: GroupStanding | null,
  _totalMatches: number,
): QualStatus {
  if (idx < 2) {
    if (belowIdx !== null && belowStanding) {
      const belowMax = belowStanding.points + (3 - belowStanding.played) * 3
      if (s.points > belowMax) return 'Q'
    }
    if (s.played === 3) return 'Q'
  }
  if (idx >= 2) {
    if (belowIdx === null && s.played === 3) return 'E'
    if (s.played === 3 && idx === 3) return 'E'
  }
  return null
}

export default memo(function GroupStage({ groups, standings, groupMatches, teamForms, groupProgress, onTeamClick }: GroupStageProps) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📊</span>
        <h2 className="text-lg font-bold text-white tracking-tight">Vòng Bảng</h2>
        <span className="text-[10px] text-[#3f3f46] ml-2 tabular-nums">
          {groups.length} bảng · 4 đội · 6 trận/bảng
        </span>
      </div>

      {/* Group summary bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {groups.map((g) => {
          const done = groupProgress[g.id] ?? 0
          const total = 6
          const pct = Math.round((done / total) * 100)
          return (
            <div
              key={g.id}
              className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-[10px]"
            >
              <span className="font-semibold text-white">{g.id}</span>
              <div className="w-10 h-1 rounded-full bg-[#27272a] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] to-[#10b981] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[#3f3f46] tabular-nums">{done}/{total}</span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {groups.map((group, gi) => {
          const gs = standings[group.id] || defaultStandings(group)
          const gm = groupMatches[group.id] || []

          return (
            <div
              key={group.id}
              className="card-hover bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden animate-fade-up"
              style={{ animationDelay: `${gi * 0.05}s` }}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#27272a] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{group.name}</h3>
                  <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
                </div>
                <span className="text-[10px] text-[#27272a] font-medium uppercase tracking-wider">Group</span>
              </div>

              {/* Standings */}
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-[11px] min-w-[360px]">
                <thead>
                  <tr className="text-[#3f3f46] border-b border-[#27272a]/50">
                    <th className="text-left pl-3 pr-1 py-2 font-medium">#</th>
                    <th className="text-left px-0 py-2 font-medium">Đội</th>
                    <th className="text-center px-1 py-2 font-medium w-6"><span className="hidden sm:inline">ST</span><span className="sm:hidden">Tr</span></th>
                    <th className="text-center px-1 py-2 font-medium w-6"><span className="hidden sm:inline">T</span><span className="sm:hidden">Th</span></th>
                    <th className="text-center px-1 py-2 font-medium w-6"><span className="hidden sm:inline">H</span><span className="sm:hidden">Hò</span></th>
                    <th className="text-center px-1 py-2 font-medium w-6"><span className="hidden sm:inline">B</span><span className="sm:hidden">Ba</span></th>
                    <th className="text-center px-1 py-2 font-medium w-5"><span className="hidden sm:inline">BT</span><span className="sm:hidden">Ghi</span></th>
                    <th className="text-center px-1 py-2 font-medium w-5"><span className="hidden sm:inline">BB</span><span className="sm:hidden">Lọt</span></th>
                    <th className="text-center px-0 py-2 font-medium w-3"><span className="hidden sm:inline">HS</span><span className="sm:hidden">+/-</span></th>
                    <th className="text-center pr-1 py-2 font-medium w-6"><span className="hidden sm:inline">Đ</span><span className="sm:hidden">Điểm</span></th>
                    <th className="text-center pr-3 py-2 font-medium w-14"><span className="hidden sm:inline">PT</span><span className="sm:hidden">P.độ</span></th>
                  </tr>
                </thead>
                <tbody>
                  {gs.map((s, idx) => {
                    const team = findTeam(group, s.teamId)
                    const qualified = idx < 2
                    const gd = s.goalsFor - s.goalsAgainst
                    const form = teamForms[s.teamId] || []
                    const below = idx < 3 ? gs[idx + 1] : null
                    const qStatus: QualStatus = getQualStatus(idx, s, idx < 3 ? idx + 1 : null, below, 6)
                    return (
                      <tr
                        key={s.teamId}
                        className={`border-b border-[#27272a]/20 last:border-0 transition-colors ${
                          qualified ? 'bg-[#10b981]/5 hover:bg-[#10b981]/10' : 'hover:bg-white/[0.02]'
                        }`}
                        onClick={() => {
                          if (team) {
                            const teamMatches = gm.filter(
                              (m) => m.homeTeamId === team.id || m.awayTeamId === team.id,
                            )
                            onTeamClick(team, s, teamMatches)
                          }
                        }}
                      >
                        <td className="pl-3 pr-1 py-3 sm:py-2.5">
                          <span className="text-[10px]">
                            {qStatus === 'Q' && idx === 0 ? '🏆' :
                             qStatus === 'Q' && idx === 1 ? '🥈' :
                             qStatus === 'E' ? '✗' :
                             idx === 0 ? '🥇' : idx === 1 ? '🥈' : (
                              <span className="text-[#3f3f46]">{idx + 1}</span>
                            )}
                          </span>
                        </td>
                        <td className="px-0 py-3 sm:py-2.5">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={team?.iso2 ? flagUrl(team.iso2) : ''}
                              alt=""
                              className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0 ring-1 ring-white/10"
                              loading="lazy"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className={`font-medium truncate max-w-[50px] sm:max-w-[70px] ${
                                qualified ? 'text-white' : 'text-[#a1a1aa]'
                              }`}>
                                {team?.nameVi || team?.name || s.teamId}
                              </span>
                              {qStatus && (
                                <span className={`text-[8px] tracking-wider uppercase font-semibold ${
                                  qStatus === 'Q' ? 'text-[#10b981]' : 'text-[#f43f5e]'
                                }`}>
                                  {qStatus === 'Q' ? 'Vào vòng 32' : 'Bị loại'}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center text-[#a1a1aa] px-1 py-3 sm:py-2.5">{s.played}</td>
                        <td className="text-center text-[#10b981] px-1 py-3 sm:py-2.5 tabular-nums">{s.won}</td>
                        <td className="text-center text-[#f59e0b] px-1 py-3 sm:py-2.5 tabular-nums">{s.drawn}</td>
                        <td className="text-center text-[#f43f5e] px-1 py-3 sm:py-2.5 tabular-nums">{s.lost}</td>
                        <td className="text-center text-[#a1a1aa] px-1 py-3 sm:py-2.5 tabular-nums text-[10px]">{s.goalsFor}</td>
                        <td className="text-center text-[#a1a1aa] px-1 py-3 sm:py-2.5 tabular-nums text-[10px]">{s.goalsAgainst}</td>
                        <td className="text-center px-0 py-3 sm:py-2.5">
                          <span className={`text-[10px] tabular-nums font-medium ${
                            gd > 0 ? 'text-[#10b981]' : gd < 0 ? 'text-[#f43f5e]' : 'text-[#3f3f46]'
                          }`}>
                            {gd > 0 ? `+${gd}` : gd}
                          </span>
                        </td>
                        <td className="text-center pr-1 py-3 sm:py-2.5">
                          <span className="font-bold text-white tabular-nums">{s.points}</span>
                        </td>
                        <td className="text-center pr-3 py-3 sm:py-2.5">
                          <div className="flex items-center justify-center gap-0.5">
                            {form.length === 0 ? (
                              <span className="text-[9px] text-[#27272a]">—</span>
                            ) : (
                              form.map((r, fi) => (
                                <span
                                  key={fi}
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    r === 'W' ? 'bg-[#10b981]' : r === 'D' ? 'bg-[#f59e0b]' : 'bg-[#f43f5e]'
                                  }`}
                                  title={r === 'W' ? 'Thắng' : r === 'D' ? 'Hòa' : 'Thua'}
                                />
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>

              {/* Matches */}
              <div className="px-4 pb-3 pt-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#3f3f46] mt-2 mb-2 uppercase tracking-widest">
                  <span>⚽</span> Trận đấu
                </div>
                {gm.length === 0 ? (
                  <p className="text-[10px] text-[#27272a] py-2 italic text-center">— Chưa có trận nào —</p>
                ) : (
                  gm.map((m) => {
                    const hd = td(group, m.homeTeamId)
                    const ad = td(group, m.awayTeamId)
                    const hasScore = m.status === 'FINISHED' || m.status === 'LIVE'
                    const isLive = m.status === 'LIVE'
                    const homeWon = hasScore && m.homeScore !== null && m.awayScore !== null && m.homeScore > m.awayScore
                    const awayWon = hasScore && m.homeScore !== null && m.awayScore !== null && m.awayScore > m.homeScore

                    return (
                      <div
                        key={m.id}
                        className="flex items-center text-[11px] py-1.5 border-b border-[#27272a]/15 last:border-0 group/dm hover:bg-white/[0.02] rounded px-1 -mx-1 transition-colors"
                      >
                        {/* Home */}
                        <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                          <span className={`truncate max-w-[60px] group-hover/dm:text-white transition-colors ${
                            homeWon ? 'text-[#10b981] font-semibold' : awayWon ? 'text-[#71717a]' : 'text-[#a1a1aa]'
                          }`}>
                            {hd.n}
                          </span>
                          {hd.iso && (
                            <img src={flagUrl(hd.iso)} alt="" className="w-4 h-3 object-cover rounded-sm flex-shrink-0 opacity-50 group-hover/dm:opacity-100 transition-opacity" loading="lazy" />
                          )}
                          {homeWon && <span className="text-[8px]">⚽</span>}
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 min-w-[40px] text-center mx-2">
                          {hasScore ? (
                            <GoalTooltip matchId={m.id}>
                              <span className={`text-xs font-bold tabular-nums tracking-tight border-b border-dotted border-[#3f3f46]/40 ${
                                isLive ? 'text-[#f43f5e]' : 'text-white'
                              }`}>
                                {m.homeScore ?? '-'}:{m.awayScore ?? '-'}
                              </span>
                            </GoalTooltip>
                          ) : (
                            <span className="text-[10px] text-[#3f3f46]">
                              {m.date ? formatDateVi(m.date) : '—'}
                            </span>
                          )}
                        </div>

                        {/* Away */}
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {awayWon && <span className="text-[8px]">⚽</span>}
                          {ad.iso && (
                            <img src={flagUrl(ad.iso)} alt="" className="w-4 h-3 object-cover rounded-sm flex-shrink-0 opacity-50 group-hover/dm:opacity-100 transition-opacity" loading="lazy" />
                          )}
                          <span className={`truncate max-w-[60px] group-hover/dm:text-white transition-colors ${
                            awayWon ? 'text-[#10b981] font-semibold' : homeWon ? 'text-[#71717a]' : 'text-[#a1a1aa]'
                          }`}>
                            {ad.n}
                          </span>
                        </div>

                        {/* Live indicator */}
                        {isLive && (
                          <span className="relative flex h-1.5 w-1.5 flex-shrink-0 ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f43f5e] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f43f5e]" />
                          </span>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-[10px] text-[#3f3f46]">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Thắng
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Hòa
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> Thua
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#22d3ee]" /> Vào vòng trong
        </span>
      </div>
    </div>
  )
})

function defaultStandings(group: Group): GroupStanding[] {
  return group.teams.map((t) => ({
    teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, points: 0,
  }))
}

function findTeam(group: Group, teamId: string): Group['teams'][number] | undefined {
  return group.teams.find((t) => t.id === teamId) || TEAMS[teamId]
}

function td(group: Group, teamId: string) {
  const t = findTeam(group, teamId)
  return { iso: t?.iso2 || null, n: t?.nameVi || t?.name || teamId }
}
