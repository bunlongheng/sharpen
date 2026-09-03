import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

// Custom hook: syncs a piece of state to localStorage.
// A custom hook is just a function that starts with "use" and calls other hooks.
// It lets you extract and REUSE stateful logic across components - a favorite interview topic.
// Generic <T> so the caller keeps full type safety on whatever it stores.
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    // Lazy initializer - runs only on the first render, not every render.
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (e.g. private mode / quota)
    }
  }, [key, value])

  return [value, setValue]
}
