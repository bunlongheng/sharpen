// Step 3: Functions & closures - declarations, defaults/rest, closures, IIFE, currying
// - Function declarations vs arrow functions differ in hoisting AND how `this` is bound.
// - Default and rest parameters replace the old `arguments`-object juggling.
// - A closure is a function that "remembers" the variables from where it was defined.
// - Currying/higher-order functions turn multi-arg functions into chains of single-arg ones.

// Function declaration - hoisted, has its own `this`.
function add(a, b) {
  return a + b
}

// Arrow function - not hoisted (it's just a const), inherits `this` from the enclosing scope.
const multiply = (a, b) => a * b

// Default + rest params: `tax` defaults if omitted, `...items` collects the rest into an array.
function total(tax = 0, ...items) {
  const sum = items.reduce((s, n) => s + n, 0)
  return sum + sum * tax
}

// Closure: makeCounter returns a function that keeps a private reference to `count`.
// Common mistake: exposing `count` directly lets callers mutate it - keep it closed over instead.
function makeCounter(start = 0) {
  let count = start
  return {
    inc: () => (count += 1),
    value: () => count,
  }
}

// IIFE (Immediately Invoked Function Expression): runs once, keeps its internals out of scope.
const iifeResult = (function () {
  const secret = 'hidden from outside'
  return secret.length
})()

// Higher-order function: takes/returns a function. Here, a simple logger-wrapper.
function withLogging(fn, log) {
  return (...args) => {
    const result = fn(...args)
    log(`called ${fn.name}(${args.join(', ')}) -> ${result}`)
    return result
  }
}

// Currying: a multi-arg function rewritten as a chain of single-arg functions.
const curriedAdd = (a) => (b) => (c) => a + b + c

export function run(log = console.log) {
  log('add(2,3):', add(2, 3))
  log('multiply(2,3):', multiply(2, 3))
  log('total with 10% tax:', total(0.1, 10, 20, 30))
  log('total with defaults (no items):', total())

  const counter = makeCounter(5)
  counter.inc()
  counter.inc()
  log('closure counter:', counter.value())

  log('iife result:', iifeResult)

  const loggedAdd = withLogging(add, log)
  loggedAdd(4, 5)

  log('curried add(1)(2)(3):', curriedAdd(1)(2)(3))
}

// Interview notes:
// - Closures are how private state works in JS without classes - each call to makeCounter gets
//   its own isolated `count`.
// - Arrow functions can't be used as constructors and don't get their own `arguments` or `this`.
// - Currying trades call-site flexibility for reusable partial application, e.g. curriedAdd(1)(2).
