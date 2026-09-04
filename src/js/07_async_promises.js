// Step 7: Async, promises & the callback -> Promise -> async/await evolution
// - Callbacks nest ("callback hell") and make error handling inconsistent; Promises fix both.
// - A Promise has 3 states (pending/fulfilled/rejected) and chains via .then/.catch/.finally.
// - async/await is sugar over Promises: it lets asynchronous code read like synchronous code.
// - Promise.all fails fast on the first rejection; allSettled waits for everything; race resolves
//   (or rejects) on whichever settles first.

// 1) Callback style - the original way. Error-first callback convention.
function callbackDelay(value, ms, cb) {
  setTimeout(() => cb(null, value), ms)
}

// 2) Promise style - wraps the callback, adds .then/.catch/.finally chaining.
function promiseDelay(value, ms, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) reject(new Error(`failed for ${value}`))
      else resolve(value)
    }, ms)
  })
}

// 3) async/await style - same promiseDelay, but read top-to-bottom like sync code.
async function asyncDelay(value, ms) {
  const result = await promiseDelay(value, ms)
  return result
}

export async function run(log = console.log) {
  await new Promise((resolve) => {
    callbackDelay('callback result', 10, (err, value) => {
      log('callback style:', value)
      resolve()
    })
  })
  // Promise chaining: then/catch/finally.
  await promiseDelay('promise result', 10)
    .then((value) => log('promise .then:', value))
    .catch((err) => log('promise .catch (unexpected):', err.message))
    .finally(() => log('promise .finally always runs'))

  // async/await - equivalent to the chain above, but linear.
  const value = await asyncDelay('async/await result', 10)
  log('async/await:', value)
  // A rejected await throws, so a normal try/catch handles it.
  try {
    await promiseDelay('will fail', 10, true)
  } catch (err) {
    log('caught rejected await:', err.message)
  }
  // Promise.all fails fast on the first rejection.
  try {
    await Promise.all([promiseDelay('ok', 10), promiseDelay('bad', 10, true)])
  } catch (err) {
    log('Promise.all rejects on first failure:', err.message)
  }
  // Promise.allSettled never rejects - gives a status per promise instead.
  const settled = await Promise.allSettled([promiseDelay('ok', 10), promiseDelay('bad', 10, true)])
  log('Promise.allSettled statuses:', settled.map((s) => s.status).join(', '))
  // Promise.race settles with whichever promise finishes first (the faster one wins here).
  const fastest = await Promise.race([promiseDelay('slow', 20), promiseDelay('fast', 10)])
  log('Promise.race winner:', fastest)

  // Common mistake: a call with no await and no .catch leaves a rejection unhandled -
  // always await it or attach .catch, even just to log it.
  const swallowed = promiseDelay('oops', 10, true).catch((err) => `handled: ${err.message}`)
  log('avoided unhandled rejection:', await swallowed)
}

// Interview notes:
// - await only pauses the async function it's in, not the whole program - other code keeps running.
// - Promise.all for "all must succeed, fail fast"; allSettled for "give me every outcome"; race for
//   "first to settle wins" (used for timeouts).
// - Every Promise chain needs a terminal .catch (or a surrounding try/catch with await) or the
//   rejection goes unhandled.
