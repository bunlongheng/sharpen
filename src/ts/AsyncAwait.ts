// Step 10: Async & real-world - typed promises, async/await, error handling

interface Todo {
  id: number
  title: string
  done: boolean
}

// A function returning a Promise<T>. `async` functions always return a Promise.
async function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// A safe result type - model success/failure in the type system instead of throwing blindly.
type Result<T> = { ok: true; value: T } | { ok: false; error: string }

async function fetchTodo(id: number): Promise<Result<Todo>> {
  try {
    const todo = await delay<Todo>({ id, title: `Task ${id}`, done: false }, 50)
    if (id < 0) throw new Error('id must be >= 0')
    return { ok: true, value: todo }
  } catch (err) {
    // `err` is `unknown` in modern TS - narrow before use.
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

export async function run(): Promise<void> {
  // Parallel awaits with Promise.all - types are preserved per position.
  const [a, b] = await Promise.all([fetchTodo(1), fetchTodo(-5)])
  console.log('a:', a.ok ? a.value.title : `error: ${a.error}`)
  console.log('b:', b.ok ? b.value.title : `error: ${b.error}`)
}

// Interview notes:
// - `async` fn returns Promise<T>; `await` unwraps it. Use `Awaited<T>` to get the resolved type.
// - In modern TS, caught errors are `unknown` - narrow with `instanceof Error` before using.
// - Prefer Promise.all for independent work (parallel) over sequential awaits.
// - A Result/Either type makes failure explicit in the signature instead of hidden throws.
