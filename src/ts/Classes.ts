// Step 8: Classes - access modifiers, abstract, interfaces, generics

interface Animal {
  name: string
  speak(): string
}

// abstract class: can't be instantiated directly; defines a contract + shared code.
abstract class Base implements Animal {
  // public (default), private (this class only), protected (this + subclasses), readonly.
  protected constructor(public readonly name: string) {}
  abstract speak(): string // subclasses MUST implement
  describe(): string {
    return `${this.name} says ${this.speak()}`
  }
}

class Dog extends Base {
  constructor(name: string) {
    super(name)
  }
  speak(): string {
    return 'Woof'
  }
}

// Parameter properties: `private count` in the constructor declares + assigns in one line.
class Counter {
  constructor(private count = 0) {}
  inc(): this {
    // returning `this` enables method chaining
    this.count++
    return this
  }
  get value(): number {
    return this.count
  }
}

// log defaults to console.log - the app injects its own logger to capture the output panel
export function run(log = console.log): void {
  const d = new Dog('Rex')
  log(d.describe())
  const c = new Counter().inc().inc().inc()
  log('counter:', c.value)
}

// Interview notes:
// - Modifiers are compile-time only (except `#private` fields, which are true runtime private).
// - `implements` checks a class matches an interface; `extends` inherits from a base class.
// - Parameter properties (constructor `private x`) cut boilerplate; returning `this` enables chaining.
// - Favor composition over deep inheritance chains.
