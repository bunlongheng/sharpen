// Step 2: Interfaces & type aliases - describing object shapes

// interface = a named object shape.
interface User {
  id: number
  name: string
  email?: string        // optional (may be undefined)
  readonly createdAt: Date // can't be reassigned after creation
}

// type alias = same idea, but also works for unions, primitives, tuples, functions.
type ID = number | string

function describe(u: User): string {
  return `#${u.id} ${u.name}${u.email ? ` <${u.email}>` : ''}`
}

export function run(): void {
  const u: User = { id: 1, name: 'Bunlong', createdAt: new Date('2026-01-01') }
  console.log(describe(u))
  // u.createdAt = new Date()  // <- fails: readonly
  const key: ID = 'abc-123'
  console.log('ID can be number or string:', key)
}

// Interview notes:
// - interface vs type: interfaces can be re-opened (declaration merging) and are idiomatic for
//   object shapes; type aliases are more flexible (unions, tuples, mapped/conditional types).
// - `?` marks optional props; `readonly` blocks reassignment (compile-time only).
// - Interfaces can `extends` other interfaces; types compose with `&` (intersection).
