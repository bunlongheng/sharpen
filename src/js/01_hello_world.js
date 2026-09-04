// Step 1: Hello World - values, let/const, template literals, typeof quirks
// - JS is dynamically typed: a variable's type is decided at runtime, not by a compiler.
// - `const` bindings can't be reassigned (the VALUE can still mutate if it's an object/array).
// - `typeof null === 'object'` is a famous, long-standing bug baked into the language.
// - `==` coerces operands before comparing; `===` never coerces. Interviewers probe this constantly.

const greeting = 'Hello, JavaScript'

// Template literals: `${expr}` interpolates and can embed any expression, not just variables.
function greet(name) {
  return `${greeting}, ${name}!`
}

// let vs const: use const by default, let only when you truly need to reassign.
let attempts = 0
attempts += 1

export function run(log = console.log) {
  log(greet('Bunlong'))
  log(`attempts is a ${typeof attempts}: ${attempts}`)

  // typeof quirk: null reports as 'object' - a historical bug that can never be fixed
  // without breaking the web. Always use `value === null` to actually test for null.
  log(`typeof null is: ${typeof null}`)
  log(`typeof undefined is: ${typeof undefined}`)
  log(`typeof NaN is: ${typeof NaN}`) // NaN is a 'number' - another surprise

  // == vs === coercion table - common mistake: using == and getting unexpected true/false.
  const pairs = [
    [0, false],
    ['0', 0],
    ['', 0],
    [null, undefined],
    [NaN, NaN],
    [1, '1'],
  ]
  log('== vs === coercion table:')
  for (const [a, b] of pairs) {
    // NaN is never equal to itself, even with ===, which is exactly why interviewers ask this.
    log(`  ${JSON.stringify(a)} == ${JSON.stringify(b)} -> ${a == b}, === -> ${a === b}`)
  }

  // const still allows mutating the referenced object - only the binding itself is locked.
  const box = { count: 1 }
  box.count = 2
  // box = {} // <- would throw: Assignment to constant variable.
  log('const object mutated:', box.count)
}

// Interview notes:
// - Reach for === by default; == only when you deliberately want coercion (rare, e.g. `x == null`
//   to catch both null and undefined in one check).
// - `typeof null === 'object'` is a quirk to memorize, not a design you should imitate.
// - const prevents rebinding the variable, not freezing the value - Object.freeze does that.
