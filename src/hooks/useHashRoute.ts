import { useCallback, useEffect, useRef, useState } from 'react'
import { storageKey } from '../storage'

import { TRACK_IDS, type Track } from '../tracks'

export type { Track }
export interface Route {
  track: Track
  step: number
}
type Counts = Record<Track, number>

const LAST_KEY = storageKey('last-step')

// "#react/3" -> { track: 'react', step: 3 }; anything malformed or out of range -> null
export function parseHash(hash: string, counts: Counts): Route | null {
  const m = new RegExp(`^#(${TRACK_IDS.join('|')})/(\\d+)$`).exec(hash)
  if (!m) return null
  const track = m[1] as Track
  const step = Number(m[2])
  return step >= 1 && step <= counts[track] ? { track, step } : null
}

function readLast(counts: Counts): Counts {
  const last = Object.fromEntries(TRACK_IDS.map((t) => [t, 1])) as Counts
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_KEY) ?? '{}') as Partial<Record<Track, unknown>>
    for (const t of TRACK_IDS) {
      const n = Number(saved[t])
      if (n >= 1 && n <= counts[t]) last[t] = n
    }
  } catch {
    // corrupt or unavailable storage - defaults stand
  }
  return last
}

// Mirrors track + step into the URL hash so every lesson is deep-linkable and survives a refresh.
// replaceState keeps browser history clean (no entry per step); hashchange covers hand-edited URLs.
// Also remembers the last step per track (persisted) so switching tracks lands where you left off.
export function useHashRoute(counts: Counts) {
  const [route, setRoute] = useState<Route>(
    () => parseHash(window.location.hash, counts) ?? { track: 'react', step: 1 },
  )
  const [initialLast] = useState(() => readLast(counts)) // read storage once, not every render
  const last = useRef<Counts>(initialLast)

  useEffect(() => {
    const h = `#${route.track}/${route.step}`
    if (window.location.hash !== h) window.history.replaceState(null, '', h)
    last.current[route.track] = route.step
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify(last.current))
    } catch {
      // private mode / quota - memory copy still works for this session
    }
  }, [route])

  useEffect(() => {
    const onHash = () => {
      const r = parseHash(window.location.hash, counts)
      if (r) setRoute(r)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [counts])

  const setTrack = useCallback((track: Track) => setRoute({ track, step: last.current[track] }), [])

  return { route, setRoute, setTrack }
}
