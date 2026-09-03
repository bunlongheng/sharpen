import { describe, it, expect } from 'vitest'
import { TS_STEPS } from '../ts'

// Every TypeScript lesson must run to completion through the injected logger and print
// something - a lesson that throws or logs nothing would render an empty output panel.
describe('TypeScript lessons run clean', () => {
  for (const step of TS_STEPS) {
    it(`${step.id}. ${step.label} (${step.file})`, async () => {
      const { run } = await step.load()
      const lines: string[] = []
      await run((...args) => lines.push(args.map(String).join(' ')))
      expect(lines.length).toBeGreaterThan(0)
      expect(lines.join('\n')).not.toMatch(/^Error:/m)
    })
  }
})
