// Step 3: Union types & narrowing - one of the most-tested TS skills

// A union: a value that is one of several types.
type Status = 'loading' | 'success' | 'error'

// Discriminated union: each member has a shared literal "tag" (kind) TS can switch on.
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }

function area(s: Shape): number {
  // "Narrowing": inside each branch, TS knows the exact member type.
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2
    case 'rect':
      return s.width * s.height
    default:
      // Exhaustiveness check: if a new Shape is added and unhandled, this line errors at compile time.
      return assertNever(s)
  }
}

function assertNever(x: never): never {
  throw new Error(`Unhandled: ${JSON.stringify(x)}`)
}

export function run(): void {
  const state: Status = 'success'
  console.log('status:', state)
  console.log('circle area:', area({ kind: 'circle', radius: 2 }).toFixed(2))
  console.log('rect area:', area({ kind: 'rect', width: 3, height: 4 }))
}

// Interview notes:
// - Narrowing: TS refines a union to a specific type via checks - typeof, instanceof, `in`,
//   equality, and truthiness guards.
// - Discriminated unions (a shared literal tag) are the clean way to model variants.
// - The `never` + assertNever trick gives you compile-time exhaustiveness on switches.
