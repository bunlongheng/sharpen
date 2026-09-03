// Step 4: Arrays, tuples & enums

const nums: number[] = [1, 2, 3]          // array of numbers
const names: Array<string> = ['a', 'b']   // generic form, same thing

// Tuple: a fixed-length array where each position has its own type.
const point: [number, number] = [10, 20]
const pair: [string, number] = ['age', 30]

// Enum: a named set of constants.
enum Direction { Up, Down, Left, Right }   // numeric: Up=0, Down=1...
enum Color { Red = 'RED', Green = 'GREEN' } // string enum (more debuggable)

// Modern alternative to enums: a const object + union of its values (smaller output, tree-shakeable).
const Role = { Admin: 'admin', User: 'user' } as const
type Role = (typeof Role)[keyof typeof Role] // 'admin' | 'user'

export function run(): void {
  console.log('sum:', nums.reduce((a, b) => a + b, 0))
  console.log('names:', names.join(', '))
  console.log('point:', point, 'pair:', pair)
  console.log('enum:', Direction.Up, Direction[0], Color.Green)
  const r: Role = Role.Admin
  console.log('role:', r)
}

// Interview notes:
// - Tuples fix both length and per-index types; great for "return two things" without an object.
// - Numeric enums are reverse-mapped (Direction[0] === 'Up'); string enums are not.
// - Many teams prefer `as const` objects + a value union over enums (no runtime cost, better types).
