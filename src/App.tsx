import { useEffect, useMemo, useState } from 'react'
import { useLiveScores } from './hooks/useLiveScores'
import { useTabs } from './hooks/useTabs'
import { useCountdown } from './hooks/useCountdown'
import Header from './components/Header'
import Tabs from './components/Tabs'
import GroupStage from './components/GroupStage'
import BracketViewer from './components/BracketViewer'
import MatchesList from './components/MatchesList'
import { TeamDetail, useTopScorers } from './components/TeamDetail'
import TEAMS from './data/teams'
import { flagUrl } from './utils/flag'
import type { Team, GroupStanding, Match } from './types'

export default function App() {
  const { matches, groups, standings, loading, error, lastUpdated, refresh } = useLiveScores()
  const { activeTab, setActiveTab } = useTabs('groups')
  const countdown = useCountdown(matches)
  const topScorers = useTopScorers(matches)
  const [selectedTeam, setSelectedTeam] = useState<{
    team: Team
    stats: GroupStanding
    matches: Match[]
  } | null>(null)

  const liveCount = matches.filter((m) => m.status === 'LIVE').length
  const finishedCount = matches.filter((m) => m.status === 'FINISHED').length

  const stats = useMemo(() => {
    const finished = matches.filter((m) => m.status === 'FINISHED')
    const totalGoals = finished.reduce((s, m) => s + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0)
    // Biggest win
    let biggestWin = { diff: 0, text: '' }
    for (const m of finished) {
      if (m.homeScore === null || m.awayScore === null) continue
      const diff = Math.abs(m.homeScore - m.awayScore)
      if (diff > biggestWin.diff) {
        biggestWin = { diff, text: `${TEAMS[m.homeScore > m.awayScore ? m.homeTeamId : m.awayTeamId]?.nameVi || '?'} ${m.homeScore}-${m.awayScore}` }
      }
    }
    return {
      totalMatches: matches.length,
      finished: finishedCount,
      live: liveCount,
      totalGoals,
      avgGoals: finished.length > 0 ? (totalGoals / finished.length).toFixed(1) : '—',
      biggestWin,
    }
  }, [matches, liveCount, finishedCount])

  // Live browser tab title
  useEffect(() => {
    const live = matches.filter((m) => m.status === 'LIVE')
    if (live.length > 0) {
      const scores = live.slice(0, 2).map((m) => {
        const h = TEAMS[m.homeTeamId]?.nameVi || m.homeTeamId
        const a = TEAMS[m.awayTeamId]?.nameVi || m.awayTeamId
        return `${h} ${m.homeScore ?? 0}-${m.awayScore ?? 0} ${a}`
      }).join(' · ')
      document.title = `⚽ ${scores} | WC 2026`
    } else {
      document.title = 'WC 2026 · World Cup'
    }
  }, [matches])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const key = e.key.toLowerCase()
      if (key === 'g') setActiveTab('groups')
      else if (key === 'b') setActiveTab('bracket')
      else if (key === 'm') setActiveTab('matches')
      else if (key === 'escape' && selectedTeam) setSelectedTeam(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setActiveTab, selectedTeam])

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col relative">
      {/* Background effects */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-grid" />
      <div className="bg-particles" />

      <Header lastUpdated={lastUpdated} error={error} onRefresh={refresh} liveCount={liveCount} />

      {/* Stats bar + countdown */}
      <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6">
        <div className="flex items-center justify-between py-2 gap-4">
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-[#3f3f46]">
              <span className="text-white font-semibold tabular-nums">{stats.totalMatches}</span> trận
            </span>
            <span className="text-[#27272a]">|</span>
            <span className="text-[#3f3f46]">
              <span className="text-[#10b981] font-semibold tabular-nums">{stats.finished}</span> đã đá
            </span>
            <span className="text-[#27272a]">|</span>
            <span className="text-[#3f3f46]">
              <span className="text-[#f43f5e] font-semibold tabular-nums">{stats.totalGoals}</span> bàn
            </span>
            <span className="text-[#27272a]">|</span>
            <span className="text-[#3f3f46]">±{stats.avgGoals} bàn/trận</span>
            {stats.biggestWin.diff >= 3 && (
              <>
                <span className="text-[#27272a]">|</span>
                <span className="text-[#3f3f46]">
                  <span className="text-[#f59e0b]">⚡</span> {stats.biggestWin.text}
                </span>
              </>
            )}
          </div>

          {countdown.match && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] ${
              countdown.isSoon ? 'bg-[#f43f5e]/5 border border-[#f43f5e]/10' : 'bg-[#18181b] border border-[#27272a]'
            }`}>
              <span className={`font-bold uppercase tracking-wider ${
                countdown.isSoon ? 'text-[#f43f5e]' : 'text-[#3f3f46]'
              }`}>
                {countdown.label}
              </span>
              <span className={`tabular-nums font-mono font-bold ${
                countdown.isSoon ? 'text-[#f43f5e] text-sm' : 'text-[#a1a1aa]'
              }`}>
                {countdown.timeLeft}
              </span>
              <span className="text-[#27272a]">·</span>
              <span className="text-[#3f3f46] max-w-[120px] truncate">
                {TEAMS[countdown.match.homeTeamId]?.nameVi || countdown.match.homeTeamId}
                {' vs '}
                {TEAMS[countdown.match.awayTeamId]?.nameVi || countdown.match.awayTeamId}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Top scorers strip */}
      {topScorers.length > 0 && (
        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 pb-1">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[9px] text-[#3f3f46] uppercase tracking-wider flex-shrink-0">
              ⚽ Ghi bàn nhiều nhất
            </span>
            {topScorers.map((sc, i) => {
              const team = TEAMS[sc.teamId]
              if (!team) return null
              return (
                <div
                  key={sc.teamId}
                  className="flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] rounded-lg px-2 py-1 flex-shrink-0"
                >
                  <span className="text-[9px] text-[#27272a] font-mono tabular-nums">
                    {i + 1}
                  </span>
                  <img src={flagUrl(team.iso2)} alt="" className="w-3.5 h-2.5 object-cover rounded-sm" />
                  <span className="text-[10px] text-[#a1a1aa] truncate max-w-[80px]">
                    {team.nameVi}
                  </span>
                  <span className="text-[10px] text-white font-bold tabular-nums ml-0.5">
                    {sc.goalCount}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {lastUpdated && (
        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#22d3ee]/20 to-transparent animate-pulse" />
        </div>
      )}

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 pb-6 relative z-10">
        {loading && matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-[#27272a] animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border border-[#27272a] animate-spin opacity-50" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 rounded-full border border-[#22d3ee]/10 animate-spin" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-float">⚽</div>
            </div>
            <div className="text-center">
              <p className="text-sm text-[#52525b] animate-breathe">Đang tải dữ liệu World Cup 2026...</p>
              <p className="text-[10px] text-[#3f3f46] mt-1">Kết nối ESPN API</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up">
            {activeTab === 'groups' && (
              <GroupStage
                groups={groups}
                standings={standings}
                matches={matches}
                onTeamClick={(team, stats, teamMatches) => setSelectedTeam({ team, stats, matches: teamMatches })}
              />
            )}
            {activeTab === 'bracket' && (
              <BracketViewer matches={matches} />
            )}
            {activeTab === 'matches' && (
              <MatchesList matches={matches} />
            )}
          </div>
        )}
      </main>

      {/* Team detail modal */}
      {selectedTeam && (
        <TeamDetail
          team={selectedTeam.team}
          standings={selectedTeam.stats}
          recentMatches={selectedTeam.matches}
          onClose={() => setSelectedTeam(null)}
        />
      )}

      {/* Footer ticker */}
      <footer className="relative z-10 border-t border-[#27272a]/50 bg-[#09090b]/80 backdrop-blur-sm overflow-hidden">
        <div className="py-1.5 overflow-hidden">
          <div className="flex gap-8 text-[10px] text-[#3f3f46]" style={{ animation: 'ticker 40s linear infinite', width: 'max-content' }}>
            <span>FIFA WORLD CUP 2026™</span><span>·</span>
            <span>CANADA</span><span>·</span>
            <span>MEXICO</span><span>·</span>
            <span>HOA KỲ</span><span>·</span>
            <span>48 ĐỘI TUYỂN</span><span>·</span>
            <span>16 BẢNG ĐẤU</span><span>·</span>
            <span>104 TRẬN ĐẤU</span><span>·</span>
            {liveCount > 0 && (<><span className="text-[#f43f5e]">● {liveCount} TRẬN ĐANG DIỄN RA</span><span>·</span></>)}
            <span className="text-[#22d3ee]/30">G</span> <span className="text-[#27272a]">Vòng Bảng</span><span>·</span>
            <span className="text-[#22d3ee]/30">B</span> <span className="text-[#27272a]">Nhánh Đấu</span><span>·</span>
            <span className="text-[#22d3ee]/30">M</span> <span className="text-[#27272a]">Trận Đấu</span><span>·</span>
            <span>FIFA WORLD CUP 2026™</span><span>·</span>
            <span>CANADA</span><span>·</span>
            <span>MEXICO</span><span>·</span>
            <span>HOA KỲ</span><span>·</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
