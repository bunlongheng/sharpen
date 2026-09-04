import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { RECORDERS } from '../../scripts/recorders.mjs'

// Recorded tracks ship stdout next to each lesson. Guard against drift: when the language's
// toolchain is installed, re-run every lesson and require the recording to match byte for byte
// (regenerate with `npm run record:lessons`). Without the toolchain, recordings must still exist.
// The fresh-run comparison is local-only: CI runners carry different compiler versions and
// platform details (paths, sizes, messages) that would make byte-equality a false alarm.
const root = join(__dirname, '..', '..')

for (const rec of RECORDERS) {
  const available = (() => {
    if (process.env.CI) return false
    try {
      execFileSync(rec.tool, rec.toolCheck, { stdio: 'ignore' })
      return true
    } catch {
      return false
    }
  })()
  describe(`${rec.label} recordings${available ? '' : ' (toolchain missing, existence only)'}`, () => {
    for (const file of rec.files(root)) {
      it(file, () => {
        const out = join(root, rec.dir, file.replace(rec.ext, '.out.txt'))
        expect(existsSync(out)).toBe(true)
        const recorded = readFileSync(out, 'utf8')
        expect(recorded.trim().length).toBeGreaterThan(0)
        if (!available) return
        expect(rec.run(root, file)).toBe(recorded)
      })
    }
  })
}
