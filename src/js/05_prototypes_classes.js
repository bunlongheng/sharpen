// Step 5: Prototypes & classes - prototype chain, constructor functions, class syntax, #private
// - Every JS object has an internal [[Prototype]] link; property lookups walk up that chain.
// - `class` is mostly syntax sugar over the same prototype mechanism constructor functions use.
// - `extends`/`super` wire up inheritance and let a subclass call its parent's constructor/methods.
// - `#field` gives TRUE runtime privacy (unlike a leading underscore, which is just a convention).

// Object.create builds an object with an explicit prototype - the low-level mechanism under class.
const animalProto = {
  describe() {
    return `${this.name} makes a sound`
  },
}
const rawAnimal = Object.create(animalProto)
rawAnimal.name = 'Generic Animal'

// Constructor function - the pre-ES6 way to make "classes". `new` sets up the prototype link.
function LegacyAnimal(name) {
  this.name = name
}
LegacyAnimal.prototype.describe = function () {
  return `${this.name} makes a sound (legacy)`
}
// class syntax - readable sugar over prototypes + constructor functions.
class Animal {
  // #private field: only accessible from inside this class, not even from subclasses directly.
  #id
  static nextId = 1 // static: lives on the class itself, shared across all instances

  constructor(name) {
    this.name = name
    this.#id = Animal.nextId++
  }

  // getter - looks like a property from the outside, runs code under the hood.
  get id() {
    return this.#id
  }

  speak() {
    return `${this.name} makes a sound`
  }
}

class Dog extends Animal {
  speak() {
    // super calls the parent's implementation instead of duplicating it.
    return `${super.speak()} - specifically, a bark`
  }
}

export function run(log = console.log) {
  log('object.create describe:', rawAnimal.describe())
  const legacy = new LegacyAnimal('Rex (legacy)')
  log('constructor function describe:', legacy.describe())
  // Prototype chain check: the method lives on the prototype, not the instance itself.
  log('method on prototype, not instance:', Object.hasOwn(legacy, 'describe') === false)
  const dog = new Dog('Rex')
  log('class + extends + super:', dog.speak())
  log('static counter assigned id:', dog.id)
  log('instanceof Animal:', dog instanceof Animal)
  log('instanceof Dog:', dog instanceof Dog)

  // Common mistake: trying to read a #private field from outside throws a SyntaxError at parse
  // time (not even a runtime check) - #fields simply don't exist outside the class body.
  // log(dog.#id) // <- would fail to even parse
  log('private field is hidden from Object.keys:', Object.keys(dog))
}

// Interview notes:
// - Lookup order: instance own properties, then its prototype, then that prototype's prototype...
//   up to Object.prototype, then null.
// - `class` fields declared with `#` are enforced by the engine, not just convention - real privacy.
// - Prefer composition over deep `extends` chains; favor `instanceof` checks sparingly (duck typing
//   or explicit tags scale better across unrelated classes).
