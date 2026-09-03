import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Context: share state across the tree WITHOUT passing props down every level ("prop drilling").
// 1. createContext gives you a Provider + a way to read the value.
// 2. Wrap the tree in <ThemeProvider>.
// 3. Any child reads it with the useTheme() hook - no props needed.
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Reuses the custom hook from Step 5 - theme persists across reloads.
  const [theme, setTheme] = useLocalStorage('rip-theme', 'light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// A tiny wrapper hook so consumers get a clear error if they forget the Provider.
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider')
  return ctx
}
