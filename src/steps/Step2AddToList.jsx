import { useState } from 'react'

// Step 2: Add to a list
// Concept: a controlled input + immutable array updates + keys.
// - The input value lives in state (controlled component).
// - You add items with [...prev, newItem], never prev.push().
// - Every list item needs a stable, unique key (not the array index if the list reorders).
export default function Step2AddToList() {
  const [text, setText] = useState('')
  const [items, setItems] = useState([])

  function addItem(e) {
    e.preventDefault() // stop the form from reloading the page
    const value = text.trim()
    if (!value) return
    setItems((prev) => [...prev, { id: crypto.randomUUID(), value }])
    setText('')
  }

  return (
    <section className="card">
      <h2>2. Add to a list</h2>
      <p className="muted">Controlled input, immutable updates, keys.</p>

      <form className="row" onSubmit={addItem}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something and press Add"
        />
        <button type="submit" disabled={!text.trim()}>Add</button>
      </form>

      {items.length === 0 ? (
        <p className="empty">No items yet.</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <li key={item.id}>{item.value}</li>
          ))}
        </ul>
      )}

      <details className="notes">
        <summary>Interview notes</summary>
        <ul>
          <li>Controlled input = value comes from state, changes flow through <code>onChange</code>.</li>
          <li>Never mutate state arrays. Spread into a new array so React sees a new reference.</li>
          <li>Keys must be stable and unique. Array index breaks when items are inserted/removed/reordered.</li>
        </ul>
      </details>
    </section>
  )
}
