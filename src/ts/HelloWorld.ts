// Step 1: Hello World - types, variables, functions
// The core idea of TypeScript: annotate values with types, and the compiler catches mistakes
// BEFORE you run the code.

// : string is a type annotation. Assigning a number here would be a compile error.
const greeting: string = 'Hello, TypeScript'

// Parameter and return types. TS ensures callers pass a string and use the string result.
function greet(name: string): string {
  return `${greeting}, ${name}!`
}

// Type inference: TS infers `age` is a number - you don't always have to write the type.
const age = 30

// log defaults to console.log - the app injects its own logger to capture the output panel
export function run(log = console.log): void {
  log(greet('Bunlong'))
  log(`Age is a ${typeof age}: ${age}`)
  // greet(42)        // <- would fail: Argument of type 'number' is not assignable to 'string'
  // const x: string = 5  // <- would fail: Type 'number' is not assignable to type 'string'
}

// Interview notes:
// - TS is a SUPERSET of JS: valid JS is valid TS. It adds a compile-time type layer, then erases
//   the types and emits plain JS (types don't exist at runtime).
// - Prefer inference for locals; annotate function params, return types, and public APIs.
// - `any` opts out of type checking (avoid it); `unknown` is the safe unknown-value type.
