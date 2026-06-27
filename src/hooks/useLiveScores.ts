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
      const merged = mergeTodayMatches(prev, todayMatches)
      updateFromMatches(merged)
      return merged
    })
    setLastUpdated(Date.now())
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fullFetch()

    const liveId = setInterval(livePoll, LIVE_POLL)
    const fullId = setInterval(() => fullFetch(true), FULL_POLL)

    return () => {
      mountedRef.current = false
      clearInterval(liveId)
      clearInterval(fullId)
    }
  }, [fullFetch, livePoll])

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
