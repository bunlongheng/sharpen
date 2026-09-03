import { useTheme } from '../context/ThemeContext'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Step 5: Custom hook + Context (the capstone of the fundamentals)
// Two of the most-asked advanced topics, combined:
// - Custom hook (useLocalStorage): reusable stateful logic, persists a note across reloads.
// - Context (useTheme): global state shared without prop drilling.
export default function HooksContext() {
  const { theme, toggle } = useTheme()
  const [note, setNote] = useLocalStorage<string>('rip-note', '')

  return (
    <section className="card">
      <h2>5. Custom hook + Context</h2>
      <p className="muted">Reusable logic + global state.</p>

      <div className="row">
        <button onClick={toggle}>
          Theme: {theme} (click to toggle)
        </button>
        <span className="muted">Global state via Context - no props passed down.</span>
      </div>

      <label className="field">
        <span>Persistent note (survives reload via a custom hook):</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type, then refresh the page"
        />
      </label>

      <details className="notes">
        <summary>Interview notes</summary>
        <ul>
          <li>A custom hook is any function starting with <code>use</code> that calls other hooks. It shares logic, not state - each caller gets its own state.</li>
          <li>Context solves prop drilling. Provider at the top, <code>useContext</code> anywhere below.</li>
          <li>Context re-renders every consumer when its value changes - split contexts or memoize the value for performance.</li>
          <li>Context is not a full state manager. For heavy/global state reach for Redux, Zustand, or Jotai.</li>
        </ul>
      </details>
    </section>
  )
}
