import { describe, it, expect } from 'vitest'

// The JS mirrors are hand-maintained copies of the TS steps (types stripped, JSX kept).
// Guard against drift: same React hook call sequence and same imported modules in both.
const ts = import.meta.glob('../steps/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>
const js = import.meta.glob('../steps-js/*.jsx', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

// TS hook calls can carry a generic (useState<Weather | null>(...)) that JS never has -
// strip it so a typed and an untyped call to the same hook compare equal.
const hooks = (src: string) =>
  (src.match(/\buse[A-Z]\w*(?:<[^>]*>)?\(/g) ?? []).map((h) => h.replace(/<[^>]*>\($/, '('))
// Compare by basename only: steps-js has no ../steps-js/__tests__ mirror, so Testing.jsx
// legitimately reaches across to steps/__tests__ for the shared raw-imported test file.
const imports = (src: string) =>
  (src.match(/from '([^']+)'/g) ?? [])
    .map((m) =>
      m
        .replace(/\.(tsx|jsx)'$/, "'")
        .split('/')
        .pop(),
    )
    .sort()

describe('steps-js mirrors match steps twins', () => {
  it('has the same number of step files', () => {
    expect(Object.keys(js).length).toBe(Object.keys(ts).length)
  })

  for (const [tsPath, tsSrc] of Object.entries(ts)) {
    const name = tsPath.replace('../steps/', '').replace(/\.tsx$/, '')
    const jsPath = `../steps-js/${name}.jsx`

    it(`${name} mirror matches`, () => {
      expect(js[jsPath]).toBeDefined()
      const jsSrc = js[jsPath]
      expect(hooks(jsSrc)).toEqual(hooks(tsSrc))
      expect(imports(jsSrc)).toEqual(imports(tsSrc))
    })
  }
})
