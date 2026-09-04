// Step 9: Iterators & generators - Symbol.iterator, generators, Map/Set, for..of vs for..in
// - The iterator protocol (Symbol.iterator) is what makes for..of, spread, and destructuring work
//   on arrays, strings, Maps, Sets, and any custom object that implements it.
// - Generator functions (`function*`) build iterators for you using `yield` instead of manual state.
// - Map and Set are proper keyed/unique collections - unlike plain objects, keys can be any type
//   and insertion order is guaranteed; WeakMap allows garbage collection of unreferenced keys.
// - for..of iterates VALUES (via the iterator protocol); for..in iterates enumerable KEYS
//   (including inherited ones) - mixing them up is a classic interview mistake.

// A custom iterable object: implementing [Symbol.iterator] makes it work with for..of and spread.
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next: () => (current <= last ? { value: current++, done: false } : { value: undefined, done: true }),
    }
  },
}

// Generator function: `yield` pauses and resumes - far less boilerplate than the manual version.
function* rangeGenerator(from, to) {
  for (let i = from; i <= to; i++) {
    yield i
  }
}

export function run(log = console.log) {
  // Custom iterable works with for..of because it implements Symbol.iterator.
  const manual = []
  for (const n of range) manual.push(n)
  log('custom iterable via for..of:', manual)
  // Spread also relies on the iterator protocol.
  log('spread of custom iterable:', [...range])

  // Generator: same result, way less code, and lazy (values computed on demand).
  log('generator via for..of:', [...rangeGenerator(1, 5)])
  const gen = rangeGenerator(10, 12)
  log('manual .next() calls:', gen.next(), gen.next(), gen.next(), gen.next())

  // Map: keys can be any type (here, an object), and insertion order is preserved.
  const objKey = { id: 1 }
  const map = new Map().set('a', 1).set(objKey, 'object key works') // set() chains, like Array methods
  log('map get by string key:', map.get('a'))
  log('map get by object key:', map.get(objKey))
  log('map size:', map.size)

  // Set: only unique values - duplicates are silently dropped.
  const set = new Set([1, 2, 2, 3, 3, 3])
  log('set dedupes:', [...set])

  // WeakMap keys must be objects, GC'd when nothing else references them - private metadata, no leak.
  const weak = new WeakMap()
  weak.set(objKey, 'metadata')
  log('weakmap get:', weak.get(objKey))

  // Common mistake: for..in on an array iterates KEYS as strings (including inherited ones),
  // not values, and doesn't guarantee numeric order.
  const arr = ['x', 'y', 'z']
  const forInKeys = []
  for (const key in arr) forInKeys.push(key) // '0', '1', '2' - strings, not numbers!
  const forOfValues = []
  for (const value of arr) forOfValues.push(value) // 'x', 'y', 'z' - the actual values
  log('for..in gives keys:', forInKeys)
  log('for..of gives values:', forOfValues)
}

// Interview notes:
// - for..of needs Symbol.iterator (arrays, strings, Map, Set, generators); for..in walks
//   enumerable property names and works on plain objects too - but skip it for arrays.
// - Generators are iterators you write with imperative-looking code; `yield` is the pause point.
// - Prefer Map over a plain object when keys aren't simple strings, or when insertion order and
//   size tracking matter.
