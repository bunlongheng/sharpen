// Step 7: Built-in utility types - transform existing types instead of rewriting them

interface User {
  id: number
  name: string
  email: string
  age: number
}

type PartialUser = Partial<User>              // all props optional
type RequiredUser = Required<PartialUser>     // all props required again
type NameOnly = Pick<User, 'id' | 'name'>     // keep only these keys
type NoEmail = Omit<User, 'email'>            // drop these keys
type ReadonlyUser = Readonly<User>            // all props readonly
type UsersById = Record<number, User>         // { [id: number]: User }

function updateUser(id: number, patch: Partial<User>): void {
  console.log(`update #${id} with`, patch)
}

export function run(): void {
  const preview: NameOnly = { id: 1, name: 'Bunlong' }
  console.log('Pick:', preview)
  updateUser(1, { age: 31 }) // Partial<User> lets us pass just one field
  const map: UsersById = { 1: { id: 1, name: 'B', email: 'b@x.com', age: 31 } }
  console.log('Record:', map[1].name)
  const _noEmail: NoEmail = { id: 1, name: 'B', age: 31 }
  const _ro: ReadonlyUser = { id: 1, name: 'B', email: 'b@x.com', age: 31 }
  const _req: RequiredUser = { id: 1, name: 'B', email: 'b@x.com', age: 31 }
  void [_noEmail, _ro, _req]
}

// Interview notes:
// - Utility types derive new types from old ones - single source of truth, no drift.
// - Most used: Partial, Required, Pick, Omit, Readonly, Record, ReturnType, Parameters, Awaited.
// - They're built FROM mapped + conditional types (Step 9) - understanding those lets you write
//   your own.
