// Step 10: Immutability patterns - freeze, structuredClone, immutable updates, debounce, memoize
// - `const` locks the binding, not the value - Object.freeze locks the value, but only shallowly.
// - structuredClone makes a true deep copy (no shared references), unlike spread.
// - Immutable updates (spread into a new object/array) never mutate state directly - the standard
//   React/Redux-style pattern for producing a new value instead.
// - debounce and memoize are the two utilities interviewers ask you to implement from scratch most.

// Object.freeze is SHALLOW - nested objects inside a frozen object are still mutable.
const frozen = Object.freeze({ name: 'config', nested: { level: 1 } })
// Debounce: delay running `fn` until `wait` ms have passed since the LAST call. Common mistake:
// forgetting to clear the previous timer, which lets every call fire independently.
function debounce(fn, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// Memoize: cache a pure function's results by its arguments so repeat calls skip recomputation.
function memoize(fn) {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) cache.set(key, fn(...args))
    return cache.get(key)
  }
}

export async function run(log = console.log) {
  // frozen.name = 'changed' silently fails in non-strict mode, throws in strict/module mode.
  try {
    frozen.name = 'changed'
  } catch (err) {
    log('freeze blocks top-level writes:', err instanceof TypeError)
  }
  // But the nested object is NOT frozen - this write succeeds, proving freeze is shallow.
  frozen.nested.level = 2
  log('freeze is shallow, nested mutation succeeded:', frozen.nested.level)
  // structuredClone makes a real deep copy - mutating the clone never touches the original.
  const original = { name: 'config', nested: { level: 1 } }
  const clone = structuredClone(original)
  clone.nested.level = 99
  log('structuredClone is deep, original untouched:', original.nested.level, 'vs clone:', clone.nested.level)
  // Immutable update pattern: build a NEW object/array instead of mutating in place.
  const state = { count: 1, items: ['a', 'b'] }
  const nextState = { ...state, count: state.count + 1, items: [...state.items, 'c'] }
  log('original state untouched:', state.count, state.items)
  log('new state via spread:', nextState.count, nextState.items)
  // Debounce demo: fire 3 times quickly, only the LAST call should actually run.
  const debounceLog = []
  const debounced = debounce((value) => debounceLog.push(value), 10)
  debounced('first')
  debounced('second')
  debounced('third')
  await new Promise((resolve) => setTimeout(resolve, 30)) // wait past the debounce window
  log('debounce only ran the last call:', debounceLog)
  // Memoize demo: the repeated call with the same args skips recomputation (see callCount).
  let callCount = 0
  const slowSquare = memoize((n) => {
    callCount++
    return n * n
  })
  slowSquare(5)
  slowSquare(5) // cached - callCount does not increment again
  slowSquare(6)
  log('memoize call count for 2x square(5) + 1x square(6):', callCount)
}

// Interview notes:
// - Object.freeze is shallow - for true deep immutability, deep-freeze recursively or use
//   structuredClone / immutable data structures.
// - Immutable updates enable cheap change detection (reference equality) - why React/Redux
//   favor spread over in-place mutation.
// - debounce waits for quiet (search-as-you-type); throttle fires at most once per interval.
