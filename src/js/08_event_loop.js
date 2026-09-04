// Step 8: The event loop - sync vs microtask vs macrotask ordering
// - JS is single-threaded: one call stack. Async work is queued, not run in parallel.
// - Microtasks (Promise .then/.catch/.finally, queueMicrotask) run AFTER the current sync code
//   finishes, but BEFORE the next macrotask.
// - Macrotasks (setTimeout, setInterval, I/O) run one at a time, and the ENTIRE microtask queue
//   drains between each macrotask.
// - `await` splits a function: code after it effectively becomes a microtask continuation.

export async function run(log = console.log) {
  const order = []

  // 1: synchronous - runs immediately, before anything queued.
  order.push('1: sync (start)')

  // Queued as a macrotask - even with 0ms delay, it waits behind ALL microtasks.
  setTimeout(() => {
    order.push('5: setTimeout 0 (macrotask)')
  }, 0)

  // Queued as a microtask via Promise.then - runs before the setTimeout above.
  Promise.resolve().then(() => {
    order.push('3: promise.then (microtask)')
  })

  // queueMicrotask is the explicit, non-Promise way to schedule a microtask.
  queueMicrotask(() => {
    order.push('4: queueMicrotask (microtask)')
  })

  // 2: still synchronous - the two callbacks above haven't run yet, they're just queued.
  order.push('2: sync (end)')

  // Nothing above has actually executed its callback yet - the call stack must empty first.
  // At this point `order` only has the two sync entries.
  await Promise.resolve() // yields to the microtask queue: everything queued so far now runs

  // By now all microtasks queued before this await have drained, but the setTimeout macrotask
  // is still waiting - macrotasks only run once the microtask queue is fully empty.
  order.push('6: after await (back in this async fn, still before the macrotask)')

  // Wait for the macrotask to actually fire so we can show the final, real order.
  await new Promise((resolve) => setTimeout(resolve, 10))
  order.push('7: confirmed after macrotask ran')

  log('execution order:')
  for (const step of order) log(`  ${step}`)

  log('')
  log('why: sync code always finishes first, then ALL queued microtasks drain completely,')
  log('then ONE macrotask runs, then the microtask queue drains again, and so on.')

  // Common mistake: assuming setTimeout(fn, 0) runs "immediately" - it never preempts microtasks
  // or even the rest of the current synchronous block.
}

// Interview notes:
// - Priority per loop tick: run all sync code -> drain the ENTIRE microtask queue -> run exactly
//   one macrotask -> drain microtasks again -> repeat.
// - Promise callbacks and queueMicrotask are both microtasks and run in the order they were queued.
// - `await` doesn't block the thread - it suspends the function and schedules the rest as a
//   microtask continuation once the awaited value settles.
