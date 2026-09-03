import { useEffect, useState } from 'react'
export default function FetchApi() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
        const data = await res.json()
        if (!ignore) setUsers(data)
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError(err.message)
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
          <li>
            The dependency array controls when the effect re-runs. <code>[]</code> = once on mount.
          </li>
          <li>
            Clean up: an <code>ignore</code> flag or <code>AbortController</code> avoids "set state
            on unmounted component" and race conditions.
          </li>
          <li>In real apps, reach for React Query / SWR instead of hand-rolling this.</li>
        </ul>
      </details>
    </section>
  )
}
