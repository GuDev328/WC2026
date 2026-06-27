import { useMemo, useState, useCallback } from 'react'
import type { Match, Team } from '../types'
import { flagUrl } from '../utils/flag'

interface Scorer {
  teamId: string
  goalCount: number
}

export function useTopScorers(matches: Match[]): Scorer[] {
  return useMemo(() => {
    const map = new Map<string, { gf: number }>()
    for (const m of matches) {
      if (m.status !== 'FINISHED' && m.status !== 'LIVE') continue
      if (!m.homeTeamId || !m.awayTeamId) continue
      const h = map.get(m.homeTeamId) || { gf: 0 }
      h.gf += m.homeScore ?? 0
      map.set(m.homeTeamId, h)
      const a = map.get(m.awayTeamId) || { gf: 0 }
      a.gf += m.awayScore ?? 0
      map.set(m.awayTeamId, a)
    }
    return [...map.entries()]
      .map(([teamId, v]) => ({ teamId, goalCount: v.gf }))
      .sort((a, b) => b.goalCount - a.goalCount)
      .slice(0, 8)
  }, [matches])
}

interface TeamDetailProps {
  team: Team
  standings: { played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number }
  recentMatches: Match[]
  onClose: () => void
}

import TEAMS from '../data/teams'

export function TeamDetail({ team, standings, recentMatches, onClose }: TeamDetailProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#18181b] border border-[#27272a] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-[#3f3f46] hover:text-white transition-colors text-lg leading-none "
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <img src={flagUrl(team.iso2)} alt="" className="w-10 h-7 object-cover rounded ring-1 ring-white/10" />
          <div>
            <h3 className="text-base font-bold text-white">{team.nameVi}</h3>
            <p className="text-[10px] text-[#3f3f46] uppercase tracking-wider">{team.name} · {team.fifaCode}</p>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            ['ST', standings.played],
            ['T', standings.won, '#10b981'],
            ['H', standings.drawn, '#f59e0b'],
            ['B', standings.lost, '#f43f5e'],
          ].map(([label, val, color]) => (
            <div key={label as string} className="bg-[#09090b] rounded-xl p-2 text-center border border-[#27272a]">
              <div className="text-[9px] text-[#3f3f46] mb-0.5">{label}</div>
              <div className="text-sm font-bold tabular-nums" style={{ color: color as string || '#e4e4e7' }}>{val as number}</div>
            </div>
          ))}
        </div>

        {/* Goal stats */}
        <div className="flex items-center gap-4 text-[11px] mb-5 bg-[#09090b] rounded-xl p-3 border border-[#27272a]">
          <div className="flex-1 text-center">
            <div className="text-[#3f3f46] text-[9px] mb-0.5">Bàn thắng</div>
            <div className="text-[#10b981] font-bold tabular-nums">{standings.goalsFor}</div>
          </div>
          <div className="w-px h-6 bg-[#27272a]" />
          <div className="flex-1 text-center">
            <div className="text-[#3f3f46] text-[9px] mb-0.5">Bàn thua</div>
            <div className="text-[#f43f5e] font-bold tabular-nums">{standings.goalsAgainst}</div>
          </div>
          <div className="w-px h-6 bg-[#27272a]" />
          <div className="flex-1 text-center">
            <div className="text-[#3f3f46] text-[9px] mb-0.5">Hiệu số</div>
            <div className="text-white font-bold tabular-nums">
              {standings.goalsFor - standings.goalsAgainst > 0 ? '+' : ''}{standings.goalsFor - standings.goalsAgainst}
            </div>
          </div>
          <div className="w-px h-6 bg-[#27272a]" />
          <div className="flex-1 text-center">
            <div className="text-[#3f3f46] text-[9px] mb-0.5">Điểm</div>
            <div className="text-white font-bold tabular-nums text-base">{standings.points}</div>
          </div>
        </div>

        {/* Recent form */}
        <div className="mb-5">
          <div className="text-[9px] text-[#3f3f46] uppercase tracking-wider mb-2">5 trận gần nhất</div>
          <div className="flex gap-1.5">
            {recentMatches.slice(0, 5).map((m, i) => {
              const isHome = m.homeTeamId === team.id
              const hs = m.homeScore ?? 0
              const as = m.awayScore ?? 0
              const won = (isHome && hs > as) || (!isHome && as > hs)
              const lost = (isHome && hs < as) || (!isHome && as < hs)
              const opponent = isHome ? m.awayTeamId : m.homeTeamId
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-lg px-1.5 py-2 text-center text-[9px] border ${
                    won ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#10b981]' :
                    lost ? 'bg-[#f43f5e]/10 border-[#f43f5e]/20 text-[#f43f5e]' :
                    'bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]'
                  }`}
                >
                  <div className="font-bold text-[10px]">
                    {s('W', won, 'D', lost, 'L')}
                  </div>
                  <div className="text-[7px] opacity-60 truncate mt-0.5">
                    {TEAMS[opponent]?.nameVi || opponent}
                  </div>
                </div>
              )
            })}
            {recentMatches.length === 0 && (
              <span className="text-[10px] text-[#27272a]">Chưa thi đấu</span>
            )}
          </div>
        </div>

        {/* Upcoming matches */}
        <div>
          <div className="text-[9px] text-[#3f3f46] uppercase tracking-wider mb-2">Trận sắp tới</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {recentMatches.filter(m => m.status === 'SCHEDULED').slice(0, 3).map((m) => {
              const opp = m.homeTeamId === team.id ? m.awayTeamId : m.homeTeamId
              return (
                <div key={m.id} className="flex items-center justify-between text-[10px] bg-[#09090b] rounded-lg px-2.5 py-2 border border-[#27272a]">
                  <span className="text-[#a1a1aa]">vs {TEAMS[opp]?.nameVi || opp}</span>
                  <span className="text-[#3f3f46]">
                    {m.date ? new Date(m.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function s(w: string, cond1: boolean, d: string, cond2: boolean, l: string): string {
  if (cond1) return w
  if (cond2) return l
  return d
}
