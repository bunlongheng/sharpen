import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { storageKey } from '../storage'

// Context: share state across the tree WITHOUT passing props down every level ("prop drilling").
// 1. createContext gives you a Provider + a way to read the value.
// 2. Wrap the tree in <ThemeProvider>.
// 3. Any child reads it with the useTheme() hook - no props needed.
type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const THEME_KEY = storageKey('theme')
// First visit follows the OS setting; the toggle persists an explicit choice after that.
const prefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
const THEME_COLOR = { light: '#f6f7f9', dark: '#0f172a' }

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Reuses the custom hook from Step 5 - theme persists across reloads.
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_KEY, prefersDark() ? 'dark' : 'light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  // Mirror the theme onto <html> so the page background, form controls, and the mobile
  // browser toolbar (theme-color) follow it - not just the .app subtree.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

// A tiny wrapper hook so consumers get a clear error if they forget the Provider.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider')
  return ctx
}
