import { useState, type ReactNode } from 'react'
import {
  MemoryRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom'

// Step 9: React Router
// Concept: client-side routing - map URLs to components, no full page reload.
// - <Routes>/<Route> declare the URL -> component map.
// - <Link> navigates without reloading; <Navigate> redirects.
// - A "protected route" is just a wrapper that redirects when the user isn't authed.
// We use MemoryRouter here so this demo has its own in-memory history and does NOT
// hijack the real address bar (which the tab shell owns). In a real app you'd use
// BrowserRouter once at the app root.
function Home() {
  return <p>Public home page. Anyone can see this.</p>
}
function About() {
  return <p>About page. Also public.</p>
}
function Dashboard() {
  return <p>Secret dashboard. Only visible when logged in.</p>
}

// The protected-route pattern: render children if authed, otherwise redirect to /login.
// In a real app, swap `authed` for Auth0's isAuthenticated (Step 6).
function RequireAuth({ authed, children }: { authed: boolean; children: ReactNode }) {
  const location = useLocation()
  if (!authed) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return <>{children}</>
}

export default function Step9Router() {
  const [authed, setAuthed] = useState(false)

  return (
    <section className="card">
      <h2>9. React Router</h2>
      <p className="muted">Client-side routing + a protected route (isolated MemoryRouter).</p>

      <MemoryRouter initialEntries={['/']}>
        <div className="row">
          <Link className="tab" to="/">Home</Link>
          <Link className="tab" to="/about">About</Link>
          <Link className="tab" to="/dashboard">Dashboard (protected)</Link>
          <button className="ghost" onClick={() => setAuthed((a) => !a)}>
            {authed ? 'Log out' : 'Log in'}
          </button>
        </div>

        <div className="router-view">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth authed={authed}>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/login"
              element={<p>You must log in to see the dashboard. Click "Log in" above.</p>}
            />
            <Route path="*" element={<p>404 - no route matched.</p>} />
          </Routes>
        </div>
      </MemoryRouter>

      <details className="notes">
        <summary>Interview notes</summary>
        <ul>
          <li><code>BrowserRouter</code> uses the History API (clean URLs); <code>MemoryRouter</code> keeps history in memory (tests, embedded demos).</li>
          <li>Protected routes = a wrapper component that checks auth and <code>&lt;Navigate&gt;</code>s away if not allowed.</li>
          <li>Pass the attempted path via <code>state</code> so you can send the user back after login.</li>
          <li><code>useNavigate</code> for programmatic navigation; <code>useParams</code> / <code>useSearchParams</code> for reading the URL.</li>
        </ul>
      </details>
    </section>
  )
}
