import { useState, useEffect, useMemo } from 'react'
import type { Match } from '../types'

interface CountdownResult {
  label: string
  timeLeft: string
  isSoon: boolean
  match: Match | null
}

export function useCountdown(matches: Match[]): CountdownResult {
  const [now, setNow] = useState(Date.now())

  const nextMatch = useMemo(() => {
    const upcoming = matches
      .filter((m) => m.status === 'SCHEDULED' && m.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return upcoming[0] || null
  }, [matches])

  // Poll fast when close (<5min), slow otherwise
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    const update = () => {
      if (nextMatch) {
        const diff = new Date(nextMatch.date).getTime() - Date.now()
        interval = setInterval(() => setNow(Date.now()), diff < 300_000 ? 1000 : 5000)
      } else {
        interval = setInterval(() => setNow(Date.now()), 30000)
      }
    }
    update()
    const bigTimer = setInterval(update, 30000)
    return () => { clearInterval(interval); clearInterval(bigTimer) }
  }, [nextMatch])

  return useMemo(() => {
    if (!nextMatch) return { label: '', timeLeft: '', isSoon: false, match: null }

    const diff = new Date(nextMatch.date).getTime() - now
    const abs = Math.abs(diff)
    const h = Math.floor(abs / 3_600_000)
    const m = Math.floor((abs % 3_600_000) / 60_000)
    const s = Math.floor((abs % 60_000) / 1000)

    if (diff <= 0 && diff > -7_200_000) {
      return { label: 'ĐANG ĐÁ', timeLeft: 'NOW', isSoon: true, match: nextMatch }
    }
    if (diff <= -7_200_000) {
      return { label: '', timeLeft: '', isSoon: false, match: null }
    }

    return {
      label: 'KHAI CUỘC SAU',
      timeLeft: h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m ${String(s).padStart(2, '0')}s`,
      isSoon: diff < 3_600_000,
      match: nextMatch,
    }
  }, [nextMatch, now])
}
