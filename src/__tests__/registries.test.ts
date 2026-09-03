import { describe, it, expect } from 'vitest'
import { REACT_STEPS } from '../steps'
import { TS_STEPS } from '../ts'

// The registries map step names to import.meta.glob keys by string - this guards the wiring.
describe('step registries', () => {
  it('every React step resolves both source strings', async () => {
    for (const s of REACT_STEPS) {
      await expect(s.loadSource()).resolves.toMatchObject({ ts: expect.any(String), js: expect.any(String) })
    }
  })

  it('every TypeScript step resolves its source and run()', async () => {
    for (const s of TS_STEPS) {
      const m = await s.load()
      expect(typeof m.run).toBe('function')
      expect(m.source).toContain('export')
    }
  })

  it('ids are 1..N with no gaps in both tracks', () => {
    expect(REACT_STEPS.map((s) => s.id)).toEqual([...Array(REACT_STEPS.length)].map((_, i) => i + 1))
    expect(TS_STEPS.map((s) => s.id)).toEqual([...Array(TS_STEPS.length)].map((_, i) => i + 1))
  })
})
