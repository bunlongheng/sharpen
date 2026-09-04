import { useTheme } from '../context/ThemeContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { storageKey } from '../storage'

const NOTE_KEY = storageKey('note')

// Step 5: Custom hook + Context (the capstone of the fundamentals)
// Two of the most-asked advanced topics, combined:
// - Custom hook (useLocalStorage): reusable stateful logic, persists a note across reloads.
// - Context (useTheme): global state shared without prop drilling.
export default function HooksContext() {
  const { theme, toggle } = useTheme()
  const [note, setNote] = useLocalStorage<string>(NOTE_KEY, '')

  return (
    <section className="card">
      <h2>5. Custom hook + Context</h2>
      <p className="muted">Reusable logic + global state.</p>

      <div className="row">
        <button onClick={toggle}>Theme: {theme} (click to toggle)</button>
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
    </section>
  )
}
