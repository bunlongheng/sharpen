import { useEffect, useState } from 'react'

// Custom hook: syncs a piece of state to localStorage.
// A custom hook is just a function that starts with "use" and calls other hooks.
// It lets you extract and REUSE stateful logic across components - a favorite interview topic.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    // Lazy initializer - runs only on the first render, not every render.
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
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
