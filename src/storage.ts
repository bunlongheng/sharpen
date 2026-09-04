// All localStorage keys go through here so the prefix lives in one place.
// Keys were 'rip-*' and then 'sharpen-*' before the Brush Up rename - migrate a value once, then drop the old key.
export const STORAGE_PREFIX = 'brushup-'
const LEGACY_PREFIXES = ['sharpen-', 'rip-']

export function storageKey(name: string): string {
  const key = STORAGE_PREFIX + name
  try {
    for (const legacy of LEGACY_PREFIXES) {
      const old = localStorage.getItem(legacy + name)
      if (old !== null) {
        if (localStorage.getItem(key) === null) localStorage.setItem(key, old)
        localStorage.removeItem(legacy + name)
      }
    }
  } catch {
    // private mode / quota - fall through with the new key
  }
  return key
}
