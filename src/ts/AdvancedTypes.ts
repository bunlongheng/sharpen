// Step 9: Advanced types - keyof, mapped, conditional, infer, template literals

interface User {
  id: number
  name: string
  active: boolean
}

// keyof: the union of an object's keys -> 'id' | 'name' | 'active'
type UserKey = keyof User

// Type-safe property getter using keyof + indexed access (User[K]).
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// Mapped type: build a new type by iterating keys. (This is how Partial is implemented.)
type Nullable<T> = { [K in keyof T]: T[K] | null }

// Conditional type + infer: extract the element type of an array.
type ElementOf<T> = T extends (infer E)[] ? E : never

// Template literal type: build string types.
type EventName<T extends string> = `on${Capitalize<T>}`

export function run(): void {
  const u: User = { id: 1, name: 'Bunlong', active: true }
  const key: UserKey = 'name'
  console.log('getProp:', getProp(u, key))         // typed as string
  const n: Nullable<User> = { id: 1, name: null, active: true }
  console.log('nullable:', n)
  const _el: ElementOf<number[]> = 42              // ElementOf<number[]> = number
  const _evt: EventName<'click'> = 'onClick'       // template literal type
  console.log('element:', _el, 'event:', _evt)
}

// Interview notes:
// - keyof + indexed access (T[K]) = the foundation of type-safe generic property access.
// - Mapped types ({ [K in keyof T]: ... }) transform every property; utility types are built on them.
// - Conditional types (T extends U ? X : Y) + `infer` let you pattern-match and extract types.
// - Template literal types compute string types (great for event names, routes, CSS units).
