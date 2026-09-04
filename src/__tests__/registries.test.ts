import { describe, it, expect } from 'vitest'
import { REACT_STEPS } from '../steps'
import { TRACKS, CODE_TRACKS } from '../tracks'

// The registries map step names to import.meta.glob keys by string - this guards the wiring.
describe('step registries', () => {
  it('every React step resolves both source strings', async () => {
    for (const s of REACT_STEPS) {
      await expect(s.loadSource()).resolves.toMatchObject({ ts: expect.any(String), js: expect.any(String) })
    }
  })

  for (const track of CODE_TRACKS) {
    it(`${track.label}: every step resolves its source and live run() or recorded output`, async () => {
      for (const s of track.steps) {
        const m = await s.load()
        expect(m.source.length).toBeGreaterThan(200)
        if (m.run) expect(typeof m.run).toBe('function')
        else expect(m.output?.trim().length).toBeGreaterThan(0)
      }
    })
  }

  it('ids are 1..N with no gaps in every track', () => {
    for (const t of TRACKS) {
      expect(t.steps.map((s) => s.id)).toEqual([...Array(t.steps.length)].map((_, i) => i + 1))
    }
  })
})
