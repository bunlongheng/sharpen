// Step 4: Scope & hoisting - var vs let/const, TDZ, hoisting, block scope in loops
// - `var` is function-scoped and hoisted with an `undefined` value; `let`/`const` are block-scoped.
// - The Temporal Dead Zone (TDZ) makes accessing a let/const BEFORE its declaration throw, not
//   silently return undefined like var does.
// - Function declarations are fully hoisted (usable before their line); function EXPRESSIONS
//   (assigned to a var/let/const) are not - only the binding is hoisted, not the value.
// - The classic var-in-loop bug: every callback in the loop shares the SAME `var i`, so by the
//   time timers fire they all see the final value. `let` fixes it by giving each iteration its
//   own binding.

// Helper: wrap setTimeout in a promise so we can await it and keep output deterministic.
function tick(ms = 10) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function run(log = console.log) {
  // var is hoisted with value undefined; let/const are hoisted but stay in the TDZ until reached.
  log('typeof hoistedVar before declaration:', typeof hoistedVar) // 'undefined', no throw
  var hoistedVar = 'now assigned'
  log('after the declaration line:', hoistedVar)

  // TDZ: reading `hoistedLet` before its declaration line throws a real ReferenceError.
  try {
    log(hoistedLet)
  } catch (err) {
    log('TDZ error caught:', err instanceof ReferenceError, err.message)
  }
  let hoistedLet = 'assigned after the TDZ'
  log('hoistedLet:', hoistedLet)

  // Function declarations hoist fully - callable before their definition appears below.
  log('calling hoisted function early:', hoistedFunctionDecl())
  function hoistedFunctionDecl() {
    return 'I work even though I am defined after the call'
  }

  // Function EXPRESSIONS do not hoist their value - only the `const` binding is (in the TDZ).
  // const early = fnExpr() // <- would throw: Cannot access 'fnExpr' before initialization
  const fnExpr = function () {
    return 'only callable after this line runs'
  }
  log('function expression after definition:', fnExpr())

  // The classic var-in-loop bug: all three callbacks share one `var i`, so they all log the
  // final value (3) once the loop has finished, not 0, 1, 2 as you'd expect.
  const varResults = []
  for (var i = 0; i < 3; i++) {
    await tick()
    varResults.push(i) // by the time this runs after each tick, i has already advanced
  }
  log('var-in-loop (each iteration mutates the SAME i):', varResults)

  // Fixed with let: each iteration gets its OWN binding, so the loop behaves as expected.
  const letResults = []
  for (let j = 0; j < 3; j++) {
    await tick()
    letResults.push(j)
  }
  log('let-in-loop (each iteration has its own j):', letResults)
}

// Interview notes:
// - Prefer let/const over var - block scoping avoids leaking loop variables and the classic
//   setTimeout-in-a-var-loop bug.
// - "Hoisting" means declarations are processed before code runs, but let/const stay unusable
//   (the TDZ) until their line executes - that's why it throws instead of returning undefined.
// - Only function DECLARATIONS hoist their value; function expressions and arrow functions don't.
