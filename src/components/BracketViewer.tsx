import { useMemo } from 'react'
import type { Match } from '../types'
import TEAMS from '../data/teams'
import { getKnockoutMatches } from '../services/api'
import { flagUrl } from '../utils/flag'

interface BracketViewerProps { matches: Match[] }

const MW = 100; const MH = 42; const GX = 26; const Y0 = 38
const LABEL: Record<string, string> = {
  R32: 'Vòng 32', R16: 'Vòng 16', QUARTER: 'Tứ Kết',
  SEMI: 'Bán Kết', THIRD_PLACE: 'Hạng Ba', FINAL: 'Chung Kết',
}

function td(tid: string | null) {
  if (!tid) return { iso: null as string | null, n: '...' }
  const t = TEAMS[tid]
  return { iso: t?.iso2 || null, n: t?.nameVi || t?.name || tid.toUpperCase() }
}

function wnr(m: Match): string | null {
  if (m.homeScore === null || m.awayScore === null) return null
  return m.homeScore > m.awayScore ? m.homeTeamId
    : m.awayScore > m.homeScore ? m.awayTeamId
    : null
}

interface Slot {
  id: string; x: number; y: number; stage: string
  home: string | null; away: string | null
  hs: number | null; as: number | null; won: string | null
}
type Conn = [string, string, boolean]

const COL_W = MW + GX

function ry(row: number, gap: number) { return Y0 + row * (MH + gap) }

function buildBracket(ko: Record<string, Match[]>) {
  const r32 = ko.R32 || []
  const slots: Slot[] = []
  const conns: Conn[] = []

  const r = (s: number) => r32[s - 1] || null
  const r16 = (s: number) => (ko.R16 || [])[s - 1] || null
  const qf = (s: number) => (ko.QUARTER || [])[s - 1] || null
  const sf = (s: number) => (ko.SEMI || [])[s - 1] || null
  const ft = ko.FINAL?.[0] || null
  const tp = ko.THIRD_PLACE?.[0] || null

  const cx = 20 + 4 * COL_W
  const rCol0 = cx + COL_W
  const botY = 7

  const add = (id: string, x: number, yy: number, stage: string, m: Match | null) => {
    slots.push({ id, x, y: yy, stage,
      home: m?.homeTeamId || null, away: m?.awayTeamId || null,
      hs: m?.homeScore ?? null, as: m?.awayScore ?? null,
      won: m ? wnr(m) : null })
  }

  // LEFT
  add('L-R32-1', 20, ry(0, 2), 'R32', r(1))
  add('L-R32-3', 20, ry(1, 2), 'R32', r(3))
  add('L-R32-2', 20, ry(3, 2), 'R32', r(2))
  add('L-R32-5', 20, ry(4, 2), 'R32', r(5))
  add('L-R16-1', 20 + COL_W, ry(0, 6), 'R16', r16(1))
  add('L-R16-2', 20 + COL_W, ry(3, 6), 'R16', r16(2))
  add('L-QF-1', 20 + 2 * COL_W, ry(1, 14), 'QUARTER', qf(1))
  for (const [a, b] of [['L-R32-1','L-R16-1'],['L-R32-3','L-R16-1'],['L-R32-2','L-R16-2'],['L-R32-5','L-R16-2'],['L-R16-1','L-QF-1'],['L-R16-2','L-QF-1']])
    conns.push([a, b, false])

  add('L-R32-9', 20, ry(botY, 2), 'R32', r(9))
  add('L-R32-10', 20, ry(botY + 1, 2), 'R32', r(10))
  add('L-R32-11', 20, ry(botY + 3, 2), 'R32', r(11))
  add('L-R32-12', 20, ry(botY + 4, 2), 'R32', r(12))
  add('L-R16-5', 20 + COL_W, ry(botY, 6), 'R16', r16(5))
  add('L-R16-6', 20 + COL_W, ry(botY + 3, 6), 'R16', r16(6))
  add('L-QF-2', 20 + 2 * COL_W, ry(botY + 1, 14), 'QUARTER', qf(2))
  for (const [a, b] of [['L-R32-9','L-R16-5'],['L-R32-10','L-R16-5'],['L-R32-11','L-R16-6'],['L-R32-12','L-R16-6'],['L-R16-5','L-QF-2'],['L-R16-6','L-QF-2']])
    conns.push([a, b, false])

  const sfYmid = (ry(1, 14) + ry(botY + 1, 14) + MH) / 2 - MH / 2
  add('L-SF', 20 + 3 * COL_W, sfYmid, 'SEMI', sf(1))
  conns.push(['L-QF-1', 'L-SF', false], ['L-QF-2', 'L-SF', false])

  // RIGHT
  add('R-R32-4', rCol0 + 3 * COL_W, ry(0, 2), 'R32', r(4))
  add('R-R32-6', rCol0 + 3 * COL_W, ry(1, 2), 'R32', r(6))
  add('R-R32-7', rCol0 + 3 * COL_W, ry(3, 2), 'R32', r(7))
  add('R-R32-8', rCol0 + 3 * COL_W, ry(4, 2), 'R32', r(8))
  add('R-R16-3', rCol0 + 2 * COL_W, ry(0, 6), 'R16', r16(3))
  add('R-R16-4', rCol0 + 2 * COL_W, ry(3, 6), 'R16', r16(4))
  add('R-QF-3', rCol0 + COL_W, ry(1, 14), 'QUARTER', qf(3))
  for (const [a, b] of [['R-R32-4','R-R16-3'],['R-R32-6','R-R16-3'],['R-R32-7','R-R16-4'],['R-R32-8','R-R16-4'],['R-R16-3','R-QF-3'],['R-R16-4','R-QF-3']])
    conns.push([a, b, false])

  add('R-R32-13', rCol0 + 3 * COL_W, ry(botY, 2), 'R32', r(13))
  add('R-R32-15', rCol0 + 3 * COL_W, ry(botY + 1, 2), 'R32', r(15))
  add('R-R32-14', rCol0 + 3 * COL_W, ry(botY + 3, 2), 'R32', r(14))
  add('R-R32-16', rCol0 + 3 * COL_W, ry(botY + 4, 2), 'R32', r(16))
  add('R-R16-7', rCol0 + 2 * COL_W, ry(botY, 6), 'R16', r16(7))
  add('R-R16-8', rCol0 + 2 * COL_W, ry(botY + 3, 6), 'R16', r16(8))
  add('R-QF-4', rCol0 + COL_W, ry(botY + 1, 14), 'QUARTER', qf(4))
  for (const [a, b] of [['R-R32-13','R-R16-7'],['R-R32-15','R-R16-7'],['R-R32-14','R-R16-8'],['R-R32-16','R-R16-8'],['R-R16-7','R-QF-4'],['R-R16-8','R-QF-4']])
    conns.push([a, b, false])

  add('R-SF', rCol0, sfYmid, 'SEMI', sf(2))
  conns.push(['R-QF-3', 'R-SF', false], ['R-QF-4', 'R-SF', false])

  // CENTER
  add('C-FINAL', cx, sfYmid - MH - 16, 'FINAL', ft)
  add('C-THIRD', cx, sfYmid + MH + 16, 'THIRD_PLACE', tp)
  conns.push(['L-SF', 'C-FINAL', false], ['R-SF', 'C-FINAL', false])
  conns.push(['L-SF', 'C-THIRD', true], ['R-SF', 'C-THIRD', true])

  const w = rCol0 + 3 * COL_W + MW + 20
  const h = ry(botY + 4, 2) + MH + 60
  return { slots, conns, w, h, cx, sfYmid }
}

export default function BracketViewer({ matches }: BracketViewerProps) {
  const ko = useMemo(() => getKnockoutMatches(matches), [matches])
  const { slots, conns, w, h, cx } = useMemo(() => buildBracket(ko), [ko])
  const byId = useMemo(() => new Map(slots.map(s => [s.id, s])), [slots])

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🏟️</span>
        <h2 className="text-lg font-bold text-white tracking-tight">Nhánh Đấu Loại Trực Tiếp</h2>
        <span className="text-[10px] text-[#3f3f46] ml-2">32 đội · Knockout</span>
      </div>

      <div className="overflow-auto rounded-xl border border-[#27272a] momentum-scroll" style={{ maxHeight: '82vh', background: '#09090b' }}>
          <svg viewBox={`0 0 ${w} ${h}`} className="block mx-auto" style={{ minWidth: `${w}px`, height: `${h}px` }}>
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.04" />
              <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.01" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="finalGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="finalBdr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" /><stop offset="50%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="thirdBdr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width={w} height={h} fill="url(#bgGlow)" />

          {/* Stadium arch silhouette */}
          <path
            d={`M${w * 0.1} ${h - 20} Q${w * 0.3} ${h - 70} ${cx + MW / 2} ${h - 55} Q${w * 0.7} ${h - 35} ${w * 0.9} ${h - 25}`}
            fill="none" stroke="#27272a" strokeWidth="1" opacity="0.3"
          />



          {/* Round labels */}
          {(['R32', 'R16', 'QUARTER', 'SEMI'] as const).map((s, i) => {
            const sl = slots.find(n => n.stage === s && n.id.startsWith('L-'))
            if (!sl) return null
            return (
              <g key={`hL-${s}`}>
                <rect x={20 + i * COL_W + MW / 2 - 28} y={5} width="56" height="16" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.5" />
                <text x={20 + i * COL_W + MW / 2} y={16}
                  textAnchor="middle" fill="#3f3f46" fontSize="8" fontWeight="700" letterSpacing="0.08em">
                  {LABEL[s]}
                </text>
              </g>
            )
          })}
          {(['SEMI', 'QUARTER', 'R16', 'R32'] as const).map((s) => {
            const sl = slots.find(n => n.stage === s && n.id.startsWith('R-'))
            if (!sl) return null
            return (
              <g key={`hR-${s}`}>
                <rect x={sl.x + MW / 2 - 28} y={5} width="56" height="16" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.5" />
                <text x={sl.x + MW / 2} y={16}
                  textAnchor="middle" fill="#3f3f46" fontSize="8" fontWeight="700" letterSpacing="0.08em">
                  {LABEL[s]}
                </text>
              </g>
            )
          })}

          {/* Final glow */}
          <circle cx={cx + MW / 2} cy={20} r="50" fill="url(#finalGlow)" opacity="0.3" className="animate-breathe" />

          {/* Central labels */}
          <rect x={cx + MW / 2 - 50} y={0} width="100" height="30" rx="6" fill="none" stroke="#f59e0b" strokeWidth="0.3" opacity="0.2" />
          <text x={cx + MW / 2} y={13} textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="800" filter="url(#glow)">
            👑 {LABEL.FINAL}
          </text>
          <text x={cx + MW / 2} y={31} textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="600">
            🥉 {LABEL.THIRD_PLACE}
          </text>

          {/* Connectors */}
          {conns.map(([from, to, dash], i) => {
            const f = byId.get(from), t = byId.get(to)
            if (!f || !t) return null
            const x0 = f.x + MW, fmy = f.y + MH / 2, x3 = t.x, tmy = t.y + MH / 2, mx = (x0 + x3) / 2
            return (
              <g key={`c${i}`}>
                {f.won && !dash && (
                  <path
                    d={`M${x0} ${fmy} L${mx} ${fmy} L${mx} ${tmy} L${x3} ${tmy}`}
                    fill="none" stroke="#22d3ee" strokeWidth="3" opacity="0.15"
                  />
                )}
                <path
                  d={`M${x0} ${fmy} L${mx} ${fmy} L${mx} ${tmy} L${x3} ${tmy}`}
                  fill="none"
                  stroke={dash ? '#27272a' : f.won ? '#22d3ee' : '#27272a'}
                  strokeWidth={f.won && !dash ? 1.5 : 0.8}
                  strokeDasharray={dash ? '4,4' : undefined}
                  opacity={dash ? 0.35 : f.won ? 0.8 : 0.5}
                  strokeLinecap="round"
                />
                {!dash && (
                  <circle cx={x3} cy={tmy} r="2.5" fill={f.won ? '#22d3ee' : '#27272a'} opacity={f.won ? 0.6 : 0.3} />
                )}
              </g>
            )
          })}

          {/* Match slots */}
          {slots.map(s => {
            const hd = td(s.home), ad = td(s.away)
            const sc = s.hs !== null && s.as !== null
            const isFinal = s.stage === 'FINAL'
            const isThird = s.stage === 'THIRD_PLACE'
            const isSemi = s.stage === 'SEMI'

            return (
              <g key={s.id} className="animate-fade-up">
                {isFinal && (
                  <rect x={s.x - 4} y={s.y - 4} width={MW + 8} height={MH + 8} rx={8}
                    fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.2" filter="url(#glow)" />
                )}

                <rect x={s.x} y={s.y} width={MW} height={MH} rx={6}
                  fill={isFinal ? '#1a1408' : isThird ? '#181425' : '#18181b'}
                  stroke={isFinal ? 'url(#finalBdr)' : isThird ? 'url(#thirdBdr)' : '#27272a'}
                  strokeWidth={isFinal || isThird ? 1.5 : 0.8}
                  opacity={isFinal || isThird ? 1 : 0.9}
                />

                {hd.iso && <image xlinkHref={flagUrl(hd.iso)} x={s.x + 7} y={s.y + 6} width="14" height="10"
                  opacity={hd.n === '...' ? 0.2 : 1} />}
                <text x={s.x + (hd.iso ? 26 : 7)} y={s.y + 17}
                  fill={s.won === s.home ? '#10b981' : hd.n === '...' ? '#27272a' : '#e4e4e7'}
                  fontSize="10" fontWeight={s.won === s.home ? '700' : '400'}>
                  {hd.n}
                </text>
                {s.won === s.home && (
                  <text x={s.x + MW - 28} y={s.y + 13} fill="#f59e0b" fontSize="8" filter="url(#glow)">★</text>
                )}
                {sc && (
                  <text x={s.x + MW - 10} y={s.y + 17} textAnchor="end"
                    fill={s.won === s.home ? '#10b981' : '#3f3f46'} fontSize="11" fontWeight="800">
                    {s.hs}
                  </text>
                )}

                {ad.iso && <image xlinkHref={flagUrl(ad.iso)} x={s.x + 7} y={s.y + 25} width="14" height="10"
                  opacity={ad.n === '...' ? 0.2 : 1} />}
                <text x={s.x + (ad.iso ? 26 : 7)} y={s.y + 35}
                  fill={s.won === s.away ? '#10b981' : ad.n === '...' ? '#27272a' : '#e4e4e7'}
                  fontSize="10" fontWeight={s.won === s.away ? '700' : '400'}>
                  {ad.n}
                </text>
                {s.won === s.away && (
                  <text x={s.x + MW - 28} y={s.y + 31} fill="#f59e0b" fontSize="8" filter="url(#glow)">★</text>
                )}
                {sc && (
                  <text x={s.x + MW - 10} y={s.y + 35} textAnchor="end"
                    fill={s.won === s.away ? '#10b981' : '#3f3f46'} fontSize="11" fontWeight="800">
                    {s.as}
                  </text>
                )}

                {(isFinal || isSemi) && (
                  <text x={s.x + 6} y={s.y + 38} fontSize="10" opacity="0.1">
                    {isFinal ? '🏆' : '⚡'}
                  </text>
                )}
                {sc && s.hs !== null && s.as !== null && Math.abs(s.hs - s.as) <= 1 && isFinal && (
                  <text x={s.x + MW - 20} y={s.y + 38} fontSize="7" fill="#f59e0b" opacity="0.5">pens?</text>
                )}
              </g>
            )
          })}

          <text x={cx + MW / 2} y={h - 8} textAnchor="middle" fill="#1f1f23" fontSize="8" fontWeight="700" letterSpacing="0.15em">
            FIFA WORLD CUP 2026™ · KNOCKOUT STAGE
          </text>

          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={`dot-${i}`}
              cx={w * 0.1 + (w * 0.8 * i) / 20} cy={h - 22} r="1"
              fill={i % 5 === 0 ? '#22d3ee' : '#27272a'} opacity={i % 5 === 0 ? 0.3 : 0.15} />
          ))}
        </svg>
      </div>
    </div>
  )
}
