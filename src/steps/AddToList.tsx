import { useState, type FormEvent } from 'react'

// Step 2: Add to a list
// Concept: a controlled input + immutable array updates + keys.
// - The input value lives in state (controlled component).
// - You add items with [...prev, newItem], never prev.push().
// - Every list item needs a stable, unique key (not the array index if the list reorders).
interface Item {
  id: string
  value: string
}

export default function AddToList() {
  const [text, setText] = useState('')
  const [items, setItems] = useState<Item[]>([])

  function addItem(e: FormEvent<HTMLFormElement>) {
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
        <button type="submit" disabled={!text.trim()}>
          Add
        </button>
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
    </section>
  )
}
