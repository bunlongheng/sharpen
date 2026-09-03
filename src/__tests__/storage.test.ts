import { describe, it, expect, beforeEach } from 'vitest'
import { storageKey } from '../storage'

describe('storageKey', () => {
  beforeEach(() => localStorage.clear())

  it('returns the sharpen-prefixed key with nothing stored', () => {
    expect(storageKey('foo')).toBe('sharpen-foo')
  })

  it('migrates a legacy rip- value to the sharpen- key and drops the old key', () => {
    localStorage.setItem('rip-foo', '1')
    storageKey('foo')
    expect(localStorage.getItem('sharpen-foo')).toBe('1')
    expect(localStorage.getItem('rip-foo')).toBeNull()
  })

  it('does not overwrite an existing new-key value', () => {
    localStorage.setItem('rip-foo', 'old')
    localStorage.setItem('sharpen-foo', 'new')
    storageKey('foo')
    expect(localStorage.getItem('sharpen-foo')).toBe('new')
    expect(localStorage.getItem('rip-foo')).toBeNull()
  })
})
