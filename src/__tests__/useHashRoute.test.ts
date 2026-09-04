import { describe, it, expect } from 'vitest'
import { parseHash } from '../hooks/useHashRoute'

const counts = { react: 10, ts: 10, js: 10, python: 10, rust: 10, php: 10, c: 10, cpp: 10, csharp: 10 }

describe('parseHash', () => {
  it('parses a valid track/step', () => {
    expect(parseHash('#react/3', counts)).toEqual({ track: 'react', step: 3 })
    expect(parseHash('#ts/10', counts)).toEqual({ track: 'ts', step: 10 })
    expect(parseHash('#python/7', counts)).toEqual({ track: 'python', step: 7 })
    expect(parseHash('#csharp/2', counts)).toEqual({ track: 'csharp', step: 2 })
  })

  it('rejects malformed or out-of-range hashes', () => {
    expect(parseHash('', counts)).toBeNull()
    expect(parseHash('#react', counts)).toBeNull()
    expect(parseHash('#vue/1', counts)).toBeNull()
    expect(parseHash('#react/0', counts)).toBeNull()
    expect(parseHash('#ts/11', counts)).toBeNull()
    expect(parseHash('#react/2/extra', counts)).toBeNull()
  })
})
