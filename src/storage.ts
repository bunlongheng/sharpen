// All localStorage keys go through here so the prefix lives in one place.
// Keys were 'rip-*' before the Sharpen rename - migrate a value once, then drop the old key.
export const STORAGE_PREFIX = 'sharpen-'
const LEGACY_PREFIX = 'rip-'

export function storageKey(name: string): string {
  const key = STORAGE_PREFIX + name
  try {
    const legacy = localStorage.getItem(LEGACY_PREFIX + name)
    if (legacy !== null) {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, legacy)
      localStorage.removeItem(LEGACY_PREFIX + name)
    }
  } catch {
    // private mode / quota - fall through with the new key
  }
  return key
}
