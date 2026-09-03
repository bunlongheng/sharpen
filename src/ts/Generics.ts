// Step 5: Generics - reusable, type-safe code

// <T> is a type variable: the caller (or inference) decides what T is.
function identity<T>(value: T): T {
  return value
}

// Generic with a constraint: T must have a `length` property.
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}

// Generic container.
class Box<T> {
  constructor(private value: T) {}
  get(): T {
    return this.value
  }
}

export function run(): void {
  console.log(identity<string>('hi'))     // explicit
  console.log(identity(42))               // inferred as number
  console.log('longest:', longest('cat', 'mouse'))
  console.log('longest arr:', longest([1], [1, 2, 3]))
  console.log('box:', new Box<number>(99).get())
}

// Interview notes:
// - Generics let one function/class work over many types WITHOUT losing type info (unlike `any`).
// - `T extends X` constrains what T can be, so you can safely use X's members.
// - TS usually infers generics from arguments - explicit <T> is only needed when it can't.
