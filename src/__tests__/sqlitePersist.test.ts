import { describe, it, expect } from 'vitest'
import { toBase64, fromStored } from '../steps/SqliteCrud'

describe('SQLite persistence encoding', () => {
  it('round-trips bytes through base64', () => {
    const bytes = new Uint8Array([0, 1, 2, 127, 128, 255, 42])
    expect(fromStored(toBase64(bytes))).toEqual(bytes)
  })

  it('round-trips a large buffer (crosses the 32KB chunk boundary)', () => {
    const bytes = new Uint8Array(70_000).map((_, i) => i % 256)
    expect(fromStored(toBase64(bytes))).toEqual(bytes)
  })

  it('still loads the legacy JSON number-array format', () => {
    const legacy = JSON.stringify([1, 2, 3, 250])
    expect(fromStored(legacy)).toEqual(new Uint8Array([1, 2, 3, 250]))
  })
})
