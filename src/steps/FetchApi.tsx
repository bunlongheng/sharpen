import { useEffect, useState } from 'react'

// Step 4: Fetch from an API
// Concept: useEffect for side effects + the 3 states every fetch has: loading, error, data.
// - The effect runs after render. The [] dependency array means "run once on mount".
// - Always handle loading AND error, not just the happy path (this is what interviewers watch for).
// - Cleanup with an "ignore" flag (or AbortController) so a slow response can't set state
//   after the component unmounted.
interface User {
  id: number
  name: string
  email: string
}

export default function FetchApi() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as User[]
        if (!ignore) setUsers(data)
      } catch (err) {
        if (!ignore && (err as Error).name !== 'AbortError') {
          setError((err as Error).message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    // Cleanup: prevents setting state after unmount and cancels the in-flight request
    return () => {
      ignore = true
      controller.abort()
    }
  }, []) // empty deps = run once on mount

  return (
    <section className="card">
      <h2>4. Fetch from an API</h2>
      <p className="muted">useEffect + loading / error / data - the real-world trio.</p>

      {loading && <p className="empty">Loading...</p>}
      {error && <p className="error">Failed to load: {error}</p>}

      {!loading && !error && (
        <ul className="list">
          {users.map((u) => (
            <li key={u.id}>
              <strong>{u.name}</strong> <span className="muted">- {u.email}</span>
            </li>
          ))}
        </ul>
      )}

      <details className="notes">
        <summary>Interview notes</summary>
        <ul>
          <li>Every fetch has 3 UI states: loading, error, success. Handle all 3.</li>
          <li>The dependency array controls when the effect re-runs. <code>[]</code> = once on mount.</li>
          <li>Clean up: an <code>ignore</code> flag or <code>AbortController</code> avoids "set state on unmounted component" and race conditions.</li>
          <li>In real apps, reach for React Query / SWR instead of hand-rolling this.</li>
        </ul>
      </details>
    </section>
  )
}
