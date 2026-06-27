import { memo, useMemo } from 'react'
import type { Match } from '../types'
import TEAMS from '../data/teams'
import { flagUrl } from '../utils/flag'
import { formatDateTimeVi } from '../utils/format'
import GoalTooltip from './GoalTooltip'

interface MatchCardProps { match: Match }

const STAGE_META: Record<string, { label: string; icon: string; accent: string }> = {
  R32: { label: 'Vòng 32', icon: '🏟️', accent: '#71717a' },
  R16: { label: 'Vòng 16', icon: '🏟️', accent: '#71717a' },
  QUARTER: { label: 'Tứ Kết', icon: '⚡', accent: '#f59e0b' },
  SEMI: { label: 'Bán Kết', icon: '🔥', accent: '#f97316' },
  FINAL: { label: 'Chung Kết', icon: '👑', accent: '#f59e0b' },
  THIRD_PLACE: { label: 'Hạng Ba', icon: '🥉', accent: '#a78bfa' },
}

function tn(teamId: string): string {
  const parts = teamId.split('-')
  const code = parts[parts.length - 1] || teamId
  return TEAMS[code]?.nameVi || TEAMS[code]?.name || teamId.toUpperCase()
}

function ti(teamId: string): string | null {
  const parts = teamId.split('-')
  const code = parts[parts.length - 1] || teamId
  return TEAMS[code]?.iso2 || null
}

// Deterministic seed from match id for stagger delay
function staggerSeed(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0
  return `${(Math.abs(h) % 200) * 0.001}s`
}

export default memo(function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'LIVE'
  const isFinished = match.status === 'FINISHED'
  const hasScore = isFinished || isLive
  const meta = STAGE_META[match.stage]

  const homeWon = hasScore && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore
  const awayWon = hasScore && match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore
  const isDraw = hasScore && match.homeScore !== null && match.awayScore !== null && match.homeScore === match.awayScore

  const homeName = useMemo(() => tn(match.homeTeamId), [match.homeTeamId])
  const awayName = useMemo(() => tn(match.awayTeamId), [match.awayTeamId])
  const homeIso = useMemo(() => ti(match.homeTeamId), [match.homeTeamId])
  const awayIso = useMemo(() => ti(match.awayTeamId), [match.awayTeamId])
  const dateStr = useMemo(() => {
    if (match.status === 'SCHEDULED' && match.date) return formatDateTimeVi(match.date)
    return null
  }, [match.status, match.date])

  const borderClass = isLive
    ? 'border-[#f43f5e]/30 live-ring'
    : match.stage === 'FINAL'
      ? 'border-[#f59e0b]/20 animate-border-glow'
      : 'border-[#27272a]'

  return (
    <div className={`card-hover bg-[#18181b] border rounded-xl p-3.5 relative overflow-hidden ${borderClass}`} style={{ animationDelay: staggerSeed(match.id) }}>
      {isLive && <div className="absolute inset-0 bg-[#10b981]/5 animate-pulse pointer-events-none" />}

      {match.stage !== 'GROUP' && meta && (
        <div className="absolute top-0 left-4 right-4 h-px rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}40, transparent)` }} />
      )}

      {(match.stage === 'FINAL' || match.stage === 'SEMI') && (
        <div className="absolute top-0 right-0 w-5 h-5 overflow-hidden"><div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f59e0b]/20 rotate-45" /></div>
      )}

      {match.stage !== 'GROUP' && meta && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md mb-3" style={{ background: `${meta.accent}10`, color: meta.accent, border: `1px solid ${meta.accent}20` }}>
          {meta.icon} {meta.label}
        </span>
      )}

      <div className="flex items-center gap-2">
        {/* Home */}
        <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
          <span className={`text-sm truncate transition-colors ${homeWon ? 'text-[#10b981] font-semibold' : 'text-[#e4e4e7] font-medium'}`}>{homeName}</span>
          <div className="relative flex-shrink-0">
            {homeIso && <img src={flagUrl(homeIso)} alt="" className="w-6 h-4 object-cover rounded ring-1 ring-white/10" loading="lazy" />}
            {isLive && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping opacity-75" />}
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0 min-w-[52px] text-center">
          {hasScore ? (
            <GoalTooltip matchId={match.id}>
              <div className="flex items-center justify-center gap-0.5 border-b border-dotted border-[#3f3f46]/50 hover:border-[#22d3ee]/50 transition-colors">
                <span className={`text-lg font-bold tabular-nums tracking-tight ${isLive ? 'text-[#f43f5e] animate-score-pop' : homeWon ? 'text-[#10b981]' : isDraw ? 'text-[#f59e0b]' : 'text-[#e4e4e7]'}`}>{match.homeScore ?? '-'}</span>
                <span className="text-[#27272a] font-bold text-sm">:</span>
                <span className={`text-lg font-bold tabular-nums tracking-tight ${isLive ? 'text-[#f43f5e] animate-score-pop' : awayWon ? 'text-[#10b981]' : isDraw ? 'text-[#f59e0b]' : 'text-[#e4e4e7]'}`}>{match.awayScore ?? '-'}</span>
              </div>
            </GoalTooltip>
          ) : (
            <span className="text-[10px] text-[#3f3f46] leading-tight whitespace-pre-line">{dateStr || 'TBD'}</span>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0">
            {awayIso && <img src={flagUrl(awayIso)} alt="" className="w-6 h-4 object-cover rounded ring-1 ring-white/10" loading="lazy" />}
            {isLive && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-ping opacity-75" />}
          </div>
          <span className={`text-sm truncate transition-colors ${awayWon ? 'text-[#10b981] font-semibold' : 'text-[#e4e4e7] font-medium'}`}>{awayName}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-2.5">
        {isLive && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#f43f5e] uppercase tracking-wide">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f43f5e] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[#f43f5e]" /></span>
            {match.minute != null ? `${match.minute}'` : 'LIVE'}
          </span>
        )}
        {isFinished && <span className="text-[10px] font-semibold text-[#3f3f46] uppercase tracking-wide">FT</span>}
        {match.venue && <span className="text-[10px] text-[#27272a]">· {match.venue}</span>}
        {match.matchNumber && <span className="text-[9px] text-[#27272a] ml-auto">#{match.matchNumber}</span>}
      </div>
    </div>
  )
})
