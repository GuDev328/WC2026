import { useState, useEffect, useCallback, useRef } from 'react'
import type { Match, GroupStanding, Group } from '../types'
import { fetchAllMatches, fetchTodayMatches, computeGroupStandings, buildGroups } from '../services/api'

interface UseLiveScoresReturn {
  matches: Match[]
  groups: Group[]
  standings: Record<string, GroupStanding[]>
  loading: boolean
  error: string | null
  lastUpdated: number | null
  refresh: () => void
}

const LIVE_POLL = 30_000
const FULL_POLL = 300_000

export function useLiveScores(): UseLiveScoresReturn {
  const [matches, setMatches] = useState<Match[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [standings, setStandings] = useState<Record<string, GroupStanding[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const fetchingRef = useRef(false)
  const mountedRef = useRef(true)
  const liveIdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fullIdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function updateFromMatches(allMatches: Match[]) {
    const g = buildGroups(allMatches)
    setGroups(g)
    setStandings(computeGroupStandings(allMatches))
  }

  function mergeTodayMatches(allMatches: Match[], todayMatches: Match[]): Match[] {
    const merged = new Map(allMatches.map((m) => [m.id, m]))
    for (const m of todayMatches) {
      merged.set(m.id, m)
    }
    return Array.from(merged.values())
  }

  function hasMatchChanged(old: Match | undefined, next: Match): boolean {
    if (!old) return true
    return (
      old.homeScore !== next.homeScore ||
      old.awayScore !== next.awayScore ||
      old.status !== next.status ||
      old.minute !== next.minute
    )
  }

  const fullFetch = useCallback(async (force = false) => {
    if (fetchingRef.current) return
    fetchingRef.current = true

    try {
      setError(null)
      const allMatches = await fetchAllMatches(force)
      if (!mountedRef.current) return

      setMatches(allMatches)
      updateFromMatches(allMatches)
      setLastUpdated(Date.now())
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu')
      }
    } finally {
      if (mountedRef.current) setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  const livePoll = useCallback(async () => {
    const todayMatches = await fetchTodayMatches()
    if (!mountedRef.current || todayMatches.length === 0) return

    setMatches((prev) => {
      // Only recompute groups/standings if live data actually changed
      let changed = false
      for (const tm of todayMatches) {
        const old = prev.find((p) => p.id === tm.id)
        if (hasMatchChanged(old, tm)) {
          changed = true
          break
        }
      }

      const merged = mergeTodayMatches(prev, todayMatches)
      if (changed) {
        updateFromMatches(merged)
      }
      return merged
    })
    setLastUpdated(Date.now())
  }, [])

  function startPolling() {
    stopPolling()
    liveIdRef.current = setInterval(livePoll, LIVE_POLL)
    fullIdRef.current = setInterval(() => fullFetch(true), FULL_POLL)
  }

  function stopPolling() {
    if (liveIdRef.current) { clearInterval(liveIdRef.current); liveIdRef.current = null }
    if (fullIdRef.current) { clearInterval(fullIdRef.current); fullIdRef.current = null }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopPolling()
    } else {
      livePoll()
      startPolling()
    }
  }

  useEffect(() => {
    mountedRef.current = true
    fullFetch()
    startPolling()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      mountedRef.current = false
      stopPolling()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    matches,
    groups,
    standings,
    loading,
    error,
    lastUpdated,
    refresh: useCallback(() => {
      setLoading(true)
      fullFetch(true)
    }, [fullFetch]),
  }
}
