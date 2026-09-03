import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const MIN_FONT = 6
const MAX_FONT = 24

// Base code font by screen width: phone 8, iPad portrait 9, landscape 10, desktop 11.
function baseFontFor(width: number): number {
  if (width <= 480) return 8
  if (width <= 834) return 9
  if (width <= 1366) return 10
  return 11
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
  // A-/A+ store an OFFSET so the base still scales with the window.
  const [delta, setDelta] = useState<number>(() => Number(localStorage.getItem('rip-code-font-delta')) || 0)
  const [base, setBase] = useState<number>(() => baseFontFor(window.innerWidth))

  useEffect(() => {
    const onResize = () => setBase(baseFontFor(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const size = Math.min(MAX_FONT, Math.max(MIN_FONT, base + delta))
  const bump = (d: number) =>
    setDelta((x) => {
      const next = x + d
      localStorage.setItem('rip-code-font-delta', String(next))
      return next
    })

  return (
    <FontContext.Provider value={{ size, inc: () => bump(1), dec: () => bump(-1), atMin: size <= MIN_FONT, atMax: size >= MAX_FONT }}>
      {children}
    </FontContext.Provider>
  )
}

export function useFont(): FontValue {
  const ctx = useContext(FontContext)
  if (!ctx) throw new Error('useFont must be used inside a FontProvider')
  return ctx
}
