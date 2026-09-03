import { useEffect, useState } from 'react'

type Loader<T> = () => Promise<T>
type Entry<T> = { load: Loader<T>; value?: T; error?: Error }

// Module-level cache keyed by loader identity: revisiting a lesson renders synchronously
// instead of flashing "Loading..." again.
const cache = new WeakMap<Loader<unknown>, unknown>()

// Resolves an async loader. Returns null while loading and the value once resolved.
// A failed load (stale deploy, offline) is THROWN during render so the nearest ErrorBoundary
// shows its retry card - it must never hang on "Loading..." forever.
export function useLoaded<T>(load: Loader<T>): T | null {
  const [state, setState] = useState<Entry<T> | null>(null)

  useEffect(() => {
    if (cache.has(load)) return
    let on = true
    load().then(
      (value) => {
        cache.set(load, value)
        if (on) setState({ load, value })
      },
      (error: unknown) => {
        if (on) setState({ load, error: error instanceof Error ? error : new Error(String(error)) })
      },
    )
    return () => {
      on = false
    }
  }, [load])

  if (cache.has(load)) return cache.get(load) as T
  if (state?.load !== load) return null
  if (state.error) throw state.error
  return state.value as T
}
