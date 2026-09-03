import { useState } from 'react'
export default function Crud() {
  const [items, setItems] = useState([
    { id: crypto.randomUUID(), value: 'Learn useState' },
    { id: crypto.randomUUID(), value: 'Build a CRUD list' },
  ])
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  // CREATE
  function add(e) {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setItems((prev) => [...prev, { id: crypto.randomUUID(), value }])
    setText('')
  }
  // DELETE
  function remove(id) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }
  // UPDATE - enter edit mode
  function startEdit(item) {
    setEditingId(item.id)
    setDraft(item.value)
  }
  // UPDATE - commit
  function saveEdit(id) {
    const value = draft.trim()
    if (!value) return
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, value } : it)))
    setEditingId(null)
    setDraft('')
  }
  return (
    <section className="card">
      <h2>3. CRUD</h2>
      <p className="muted">Create, read, update, delete - the everyday React list.</p>

      <form className="row" onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New item" />
        <button type="submit" disabled={!text.trim()}>
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="empty">Nothing here. Add one above.</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <li key={item.id} className="crud-row">
              {editingId === item.id ? (
                <>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
                  <span className="row">
                    <button onClick={() => saveEdit(item.id)}>Save</button>
                    <button className="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span>{item.value}</span>
                  <span className="row">
                    <button className="ghost" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button className="danger" onClick={() => remove(item.id)}>
                      Delete
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
