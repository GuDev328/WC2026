import { useState, useEffect, useCallback, useRef } from 'react'
import type { Match, GroupStanding, Group } from '../types'
import { fetchAllMatches, computeGroupStandings, buildGroups } from '../services/api'

interface UseLiveScoresReturn {
  matches: Match[]
  groups: Group[]
  standings: Record<string, GroupStanding[]>
  loading: boolean
  error: string | null
  lastUpdated: number | null
  refresh: () => void
}

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
    setGroups(buildGroups(allMatches))
    setStandings(computeGroupStandings(allMatches))
  }

  const doFetch = useCallback(async (force = false) => {
    if (fetchingRef.current) return
    fetchingRef.current = true

    try {
      setError(null)
      const data = await fetchAllMatches(force)
      if (!mountedRef.current) return

      setMatches(data)
      updateFromMatches(data)
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

  useEffect(() => {
    mountedRef.current = true
    doFetch()

    const id = setInterval(() => doFetch(true), 300_000)
    return () => {
      mountedRef.current = false
      clearInterval(id)
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
      doFetch(true)
    }, [doFetch]),
  }
}
