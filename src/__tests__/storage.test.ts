import { describe, it, expect, beforeEach } from 'vitest'
import { storageKey } from '../storage'

describe('storageKey', () => {
  beforeEach(() => localStorage.clear())

  it('returns the brushup-prefixed key with nothing stored', () => {
    expect(storageKey('foo')).toBe('brushup-foo')
  })

  it('migrates a legacy rip- value to the brushup- key and drops the old key', () => {
    localStorage.setItem('rip-foo', '1')
    storageKey('foo')
    expect(localStorage.getItem('brushup-foo')).toBe('1')
    expect(localStorage.getItem('rip-foo')).toBeNull()
  })

  it('does not overwrite an existing new-key value', () => {
    localStorage.setItem('rip-foo', 'old')
    localStorage.setItem('brushup-foo', 'new')
    storageKey('foo')
    expect(localStorage.getItem('brushup-foo')).toBe('new')
    expect(localStorage.getItem('rip-foo')).toBeNull()
  })
})

describe('storageKey migrates the previous brand prefix too', () => {
  it('moves a sharpen-* value to brushup-*', () => {
    localStorage.clear()
    localStorage.setItem('sharpen-foo', 'kept')
    expect(storageKey('foo')).toBe('brushup-foo')
    expect(localStorage.getItem('brushup-foo')).toBe('kept')
    expect(localStorage.getItem('sharpen-foo')).toBeNull()
  })
})
