import { describe, it, expect } from 'vitest'
import { TS_STEPS } from '../ts'
import { JS_STEPS } from '../js'

// Every browser-runnable lesson must run to completion through the injected logger and print
// something - a lesson that throws or logs nothing would render an empty output panel.
for (const [name, steps] of [
  ['TypeScript', TS_STEPS],
  ['JavaScript', JS_STEPS],
] as const) {
  describe(`${name} lessons run clean`, () => {
    for (const step of steps) {
      it(`${step.id}. ${step.label} (${step.file})`, async () => {
        const { run } = await step.load()
        if (!run) throw new Error('live lessons must export run()')
        const lines: string[] = []
        await run((...args) => lines.push(args.map(String).join(' ')))
        expect(lines.length).toBeGreaterThan(0)
        expect(lines.join('\n')).not.toMatch(/^Error:/m)
      })
    }
  })
}
