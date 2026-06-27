import { useMemo, useState } from 'react'
import type { Match } from '../types'
import MatchCard from './MatchCard'

interface MatchesListProps { matches: Match[] }

const DAY_LABELS: Record<string, string> = {
  '0': 'CN', '1': 'T2', '2': 'T3', '3': 'T4', '4': 'T5', '5': 'T6', '6': 'T7',
}

export default function MatchesList({ matches }: MatchesListProps) {
  const [filter, setFilter] = useState<'LIVE' | 'FINISHED' | 'SCHEDULED'>('FINISHED')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const subset = matches.filter((m) => m.status === filter)
    return [...subset].sort((a, b) => {
      if (filter === 'SCHEDULED') {
        return a.date.localeCompare(b.date)
      }
      return b.date.localeCompare(a.date)
    })
  }, [matches, filter])

  // Group by date for SCHEDULED, show as carousel
  const dayGroups = useMemo(() => {
    const days = new Map<string, Match[]>()
    for (const m of filtered) {
      if (!m.date) continue
      const key = m.date.split('T')[0]
      if (!days.has(key)) days.set(key, [])
      days.get(key)!.push(m)
    }
    return [...days.entries()]
      .sort(([a], [b]) => filter === 'SCHEDULED' ? a.localeCompare(b) : b.localeCompare(a))
  }, [filtered, filter])

  const displayMatches = selectedDay
    ? filtered.filter((m) => m.date?.startsWith(selectedDay))
    : filtered

  // Single-pass counts
  const counts = useMemo(() => {
    let live = 0, finished = 0, scheduled = 0
    for (const m of matches) {
      if (m.status === 'LIVE') live++
      else if (m.status === 'FINISHED') finished++
      else if (m.status === 'SCHEDULED') scheduled++
    }
    return { LIVE: live, FINISHED: finished, SCHEDULED: scheduled }
  }, [matches])

  // Memoized formatted date labels for day carousel
  const dayLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    for (const [day] of dayGroups) {
      labels[day] = dayLabel(day)
    }
    return labels
  }, [dayGroups])

  const tabs: { key: typeof filter; label: string; icon: string; color: string }[] = [
    { key: 'FINISHED', label: 'Đã đấu', icon: '✓', color: '#a1a1aa' },
    { key: 'LIVE', label: 'Trực tiếp', icon: '●', color: '#f43f5e' },
    { key: 'SCHEDULED', label: 'Sắp đấu', icon: '○', color: '#71717a' },
  ]

  const totalGoals = useMemo(() => {
    return matches
      .filter((m) => m.status === 'FINISHED')
      .reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0)
  }, [matches])

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col items-center mb-6 gap-1">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <span className="text-xl">⚽</span>
          Trận Đấu
        </h2>
        <div className="flex gap-4 text-[10px] text-[#3f3f46] mb-2">
          <span>{matches.length} trận</span>
          <span>·</span>
          <span>{totalGoals} bàn thắng</span>
          <span>·</span>
          <span>{counts.LIVE > 0 ? `${counts.LIVE} đang đá` : '0 đang đá'}</span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center bg-[#18181b] rounded-xl p-1 border border-[#27272a] shadow-lg shadow-black/20">
          {tabs.map(({ key, label, icon, color }) => {
            const active = filter === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => { setFilter(key); setSelectedDay(null) }}
                className={`relative px-3 sm:px-4 py-2.5 sm:py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 touch-target ${
                  active
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-[#71717a] hover:text-[#a1a1aa]'
                }`}
              >
                {key === 'LIVE' && active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse" />
                )}
                <span style={{ color: active ? color : undefined }}>{icon}</span>
                {label}
                <span className={`ml-1 text-[10px] tabular-nums ${
                  active ? 'text-[#3f3f46]' : 'text-[#27272a]'
                }`}>
                  {counts[key]}
                </span>
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Date carousel */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none momentum-scroll max-w-full">
        <button
          type="button"
          onClick={() => setSelectedDay(null)}
          className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0  border ${
            selectedDay === null
              ? 'bg-white/10 text-white border-[#3f3f46]'
              : 'text-[#3f3f46] border-transparent hover:text-[#a1a1aa]'
          }`}
        >
          Tất cả
        </button>
        {dayGroups.map(([day, dayMatches]) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(selectedDay === day ? null : day)}
            className={`text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0  border whitespace-nowrap ${
              selectedDay === day
                ? 'bg-white/10 text-white border-[#3f3f46]'
                : 'text-[#3f3f46] border-transparent hover:text-[#a1a1aa]'
            }`}
          >
            {dayLabels[day] ?? day}
            <span className="ml-1 text-[#27272a]">{dayMatches.length}</span>
          </button>
        ))}
      </div>

      {/* Matches grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-3">
          <div className="text-4xl opacity-15 animate-float">⚽</div>
          <p className="text-xs text-[#27272a]">
            {matches.length === 0 ? 'Đang tải dữ liệu...' : 'Không có trận đấu'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {displayMatches.map((match, i) => (
            <div key={match.id} style={{ animationDelay: `${i * 0.03}s` }} className="animate-fade-up">
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function dayLabel(day: string): string {
  const date = new Date(day + 'T00:00:00')
  const dow = date.getDay()
  const dom = date.getDate()
  const month = date.getMonth() + 1
  return `${DAY_LABELS[String(dow)]} ${String(dom).padStart(2, '0')}/${String(month).padStart(2, '0')}`
}
