// Step 6: `this` binding - implicit, explicit, new, lost `this`, arrow functions
// - `this` is determined by HOW a function is called, not where it's defined (except arrows).
// - Implicit binding: `obj.method()` binds `this` to `obj`. Explicit: call/apply/bind override it.
// - `new Fn()` creates a fresh object and binds `this` to it.
// - Arrow functions have no `this` of their own - they capture it lexically from the enclosing scope.

const counter = {
  count: 0,
  // Regular method - `this` depends on the call site.
  inc() {
    this.count++
    return this.count
  },
}

function standalone() {
  // In a plain function call (no receiver), `this` is undefined in strict/module code.
  return this
}

function Point(x, y) {
  // `new` binding: `this` is the newly created object.
  this.x = x
  this.y = y
}

export function run(log = console.log) {
  // Implicit binding: `this` is `counter` because it was called as `counter.inc()`.
  log('implicit binding:', counter.inc())

  // Explicit binding: call/apply/bind let you choose `this` yourself.
  const detached = { count: 100 }
  log('call:', counter.inc.call(detached))
  log('apply:', counter.inc.apply(detached))
  const boundInc = counter.inc.bind(detached)
  log('bind:', boundInc())

  // new binding.
  const p = new Point(3, 4)
  log('new binding:', `(${p.x}, ${p.y})`)

  // standalone() has no receiver - `this` is undefined here (ES modules run in strict mode).
  log('plain call this is undefined:', standalone() === undefined)

  // Common mistake: extracting a method loses its receiver, so `this` is no longer `counter`.
  const extracted = counter.inc
  try {
    extracted() // `this` is undefined here -> reading this.count throws
  } catch (err) {
    log('lost `this` on extracted method:', err instanceof TypeError)
  }
  // The fix: bind it (or use an arrow wrapper) to lock `this` to the right object.
  const fixed = counter.inc.bind(counter)
  log('fixed with bind:', fixed())

  // Arrow functions capture `this` lexically - they ignore call/apply/bind for `this`.
  const arrowObj = {
    count: 0,
    incArrow: () => {
      // `this` here is whatever `this` was OUTSIDE this object literal (module scope: undefined) -
      // NOT arrowObj. Arrow methods on object literals are a classic footgun.
      return typeof this
    },
  }
  log('arrow method does not bind to its object:', arrowObj.incArrow())
}

// Interview notes:
// - Precedence when multiple rules could apply: new > explicit (call/apply/bind) > implicit > default.
// - Arrow functions are never a fix for "I need a method with its own `this`" - they're a fix for
//   "I need to inherit the surrounding `this`" (e.g. inside a callback within a method).
// - bind() returns a NEW function permanently locked to that `this`; call/apply invoke immediately.
