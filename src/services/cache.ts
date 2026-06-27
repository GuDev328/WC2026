const CACHE_VERSION = 'v4'
const CACHE_PREFIX = `wc2026_${CACHE_VERSION}_`

export const CACHE_DURATION = {
  SCORES: 45_000, // 45 seconds for live scores
  STANDINGS: 300_000, // 5 minutes for standings
}

function cacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(cacheKey(key))
    if (!raw) return null

    const parsed = JSON.parse(raw) as { data: T; expiresAt: number; version: string }

    if (!parsed || typeof parsed.expiresAt !== 'number' || parsed.version !== CACHE_VERSION) {
      localStorage.removeItem(cacheKey(key))
      return null
    }

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(cacheKey(key))
      return null
    }

    return parsed.data
  } catch {
    return null
  }
}

export function setCached<T>(key: string, data: T, ttl: number): void {
  try {
    localStorage.setItem(
      cacheKey(key),
      JSON.stringify({ data, expiresAt: Date.now() + ttl, version: CACHE_VERSION }),
    )
  } catch {
    // localStorage full or unavailable — silently fail, data will re-fetch
  }
}

// Clear old cache versions on load
export function clearStaleCaches(): void {
  try {
    const keys = Object.keys(localStorage)
    for (const key of keys) {
      if (key.startsWith('wc2026_') && !key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // Ignore
  }
}
