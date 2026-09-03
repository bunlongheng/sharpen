import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { storageKey } from './storage'
import { useLocalStorage } from './hooks/useLocalStorage'

const MIN_FONT = 8
const MAX_FONT = 24
const FONT_KEY = storageKey('code-font-delta')

// Base code font by screen width: phone 11, iPad 11, desktop 12 (the +/- buttons add an offset).
function baseFontFor(width: number): number {
  if (width <= 1366) return 11
  return 12
}

interface FontValue {
  size: number
  inc: () => void
  dec: () => void
  atMin: boolean
  atMax: boolean
}

const FontContext = createContext<FontValue | null>(null)

export function FontProvider({ children }: { children: ReactNode }) {
  // The +/- buttons store an OFFSET so the base still scales with the window.
  const [delta, setDelta] = useLocalStorage<number>(FONT_KEY, 0)
  const [base, setBase] = useState<number>(() => baseFontFor(window.innerWidth))

  useEffect(() => {
    const onResize = () => setBase(baseFontFor(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const size = Math.min(MAX_FONT, Math.max(MIN_FONT, base + delta))
  const bump = (d: number) => setDelta((x) => x + d)

  return (
    <FontContext.Provider
      value={{
        size,
        inc: () => bump(1),
        dec: () => bump(-1),
        atMin: size <= MIN_FONT,
        atMax: size >= MAX_FONT,
      }}
    >
      {children}
    </FontContext.Provider>
  )
}

export function useFont(): FontValue {
  const ctx = useContext(FontContext)
  if (!ctx) throw new Error('useFont must be used inside a FontProvider')
  return ctx
}
