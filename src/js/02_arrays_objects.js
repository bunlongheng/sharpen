// Step 2: Arrays & objects - map/filter/reduce, destructuring, spread, optional chaining
// - Array methods (map/filter/reduce/find/some) are the idiomatic replacement for manual for-loops.
// - Destructuring with defaults and nesting pulls values out of objects/arrays in one expression.
// - Spread copies (shallow!) instead of mutating; Object.assign predates spread and does the same.
// - Optional chaining (?.) short-circuits to undefined instead of throwing on a missing property.

const users = [
  { id: 1, name: 'Ada', age: 32, address: { city: 'London' } },
  { id: 2, name: 'Grace', age: 41 },
  { id: 3, name: 'Alan', age: 28, address: { city: 'Manchester' } },
]

export function run(log = console.log) {
  // map/filter/reduce/find/some - each returns something different, don't mix them up.
  const names = users.map((u) => u.name)
  const over30 = users.filter((u) => u.age >= 30)
  const totalAge = users.reduce((sum, u) => sum + u.age, 0)
  const grace = users.find((u) => u.name === 'Grace')
  const anyMinor = users.some((u) => u.age < 18)
  log('names:', names.join(', '))
  log('over30:', over30.map((u) => u.name).join(', '))
  log('totalAge:', totalAge)
  log('find grace:', grace?.name)
  log('anyMinor:', anyMinor)

  // Destructuring: nested + defaults. `country` doesn't exist, so the default kicks in.
  const { name, address: { city, country = 'Unknown' } = {} } = users[0]
  log(`destructured: ${name} lives in ${city}, ${country}`)

  // Array destructuring with defaults and a rest element.
  const [first, second = 'fallback', ...rest] = ['only-one']
  log('array destructure:', first, second, rest)

  // Spread vs Object.assign - both produce a NEW shallow copy; mutating one doesn't touch the other.
  const merged = { ...users[1], active: true }
  const mergedOld = Object.assign({}, users[1], { active: true })
  log('spread merge:', JSON.stringify(merged) === JSON.stringify(mergedOld))
  // Common mistake: spread only copies one level deep - nested objects are still shared references.
  const shallow = { ...users[0] }
  shallow.address.city = 'Mutated!'
  log('shallow copy leaked into original:', users[0].address.city)

  // Optional chaining avoids "Cannot read properties of undefined" on the users without an address.
  log('grace city (optional chaining):', users[1].address?.city ?? 'no address on file')

  // Computed keys build property names dynamically.
  const key = 'dynamicKey'
  const computed = { [key]: 42, [`${key}_doubled`]: 84 }
  log('computed keys:', JSON.stringify(computed))

  // Object.entries turns an object into [key, value] pairs, unlocking map/filter on it.
  for (const [k, v] of Object.entries(computed)) {
    log(`entry ${k} = ${v}`)
  }
}

// Interview notes:
// - forEach returns undefined - never chain off it; use map when you need a new array.
// - reduce is the most general of the bunch; map/filter are reduce specialized (know the tradeoff).
// - Spread/Object.assign copy shallowly - deep-clone nested structures explicitly when needed.
