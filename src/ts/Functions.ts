// Step 6: Functions in depth - optional/default/rest params, overloads

// Optional (?) and default params.
function greet(name: string, greeting = 'Hello'): string {
  return `${greeting}, ${name}`
}

// Rest params: gather the rest into a typed array.
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}

// Function overloads: multiple signatures, one implementation.
function parse(input: string): string[]
function parse(input: number): number[]
function parse(input: string | number): string[] | number[] {
  return typeof input === 'string' ? input.split('') : [input]
}

// Typing a callback parameter.
function map<T, U>(arr: T[], fn: (item: T, index: number) => U): U[] {
  return arr.map(fn)
}

// log defaults to console.log - the app injects its own logger to capture the output panel
export function run(log = console.log): void {
  log(greet('Bunlong'))
  log(greet('Bunlong', 'Hi'))
  log('sum:', sum(1, 2, 3, 4))
  log('parse string:', parse('abc')) // typed as string[]
  log('parse number:', parse(7)) // typed as number[]
  log(
    'map:',
    map([1, 2, 3], (n) => n * 2),
  )
}

// Interview notes:
// - Overloads describe several call shapes; the implementation signature is not directly callable.
// - Prefer union params or generics over overloads when they suffice - overloads are verbose.
// - `void` return means "ignore the return"; a `(...) => void` callback may still return a value.
