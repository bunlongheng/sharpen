import { useEffect, useRef, useState } from 'react'
import initSqlJs from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'
import { storageKey } from '../storage'
const STORAGE_KEY = storageKey('sqlite')
// base64 keeps the stored DB ~4x smaller than the old JSON number-array format
function toBase64(bytes) {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(bin)
}
function fromStored(saved) {
  if (saved.startsWith('[')) {
    // legacy JSON number-array format - still loadable
    return new Uint8Array(JSON.parse(saved))
  }
  const bin = atob(saved)
  return Uint8Array.from(bin, (c) => c.charCodeAt(0))
}
function persist(db) {
  try {
    localStorage.setItem(STORAGE_KEY, toBase64(db.export()))
  } catch {
    // quota exceeded or private mode - the in-memory DB still works for this session
  }
}
export default function SqliteCrud() {
  const dbRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  // Read all rows out of SQLite and into React state.
  function refresh() {
    const db = dbRef.current
    if (!db) return
    const res = db.exec('SELECT id, title FROM tasks ORDER BY id')
    const rows = res.length ? res[0].values.map((r) => ({ id: Number(r[0]), title: String(r[1]) })) : []
    setTasks(rows)
  }
  useEffect(() => {
    let cancelled = false
    async function boot() {
      try {
        const SQL = await initSqlJs({ locateFile: () => wasmUrl })
        if (cancelled) return
        // Load the saved DB from localStorage, or create a fresh one.
        const saved = localStorage.getItem(STORAGE_KEY)
        const db = saved ? new SQL.Database(fromStored(saved)) : new SQL.Database()
        db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)')
        if (!saved) {
          db.run("INSERT INTO tasks (title) VALUES ('Ship the feature'), ('Write tests')")
          persist(db)
        }
        dbRef.current = db
        setReady(true)
        refresh()
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])
  // CREATE - parameterized query (never string-concat user input -> SQL injection)
  function add(e) {
    e.preventDefault()
    const db = dbRef.current
    const value = title.trim()
    if (!db || !value) return
    db.run('INSERT INTO tasks (title) VALUES (?)', [value])
    persist(db)
    setTitle('')
    refresh()
  }
  // UPDATE
  function saveEdit(id) {
    const db = dbRef.current
    const value = draft.trim()
    if (!db || !value) return
    db.run('UPDATE tasks SET title = ? WHERE id = ?', [value, id])
    persist(db)
    setEditingId(null)
    setDraft('')
    refresh()
  }
  // DELETE
  function remove(id) {
    const db = dbRef.current
    if (!db) return
    db.run('DELETE FROM tasks WHERE id = ?', [id])
    persist(db)
    refresh()
  }
  if (error) {
    return (
      <section className="card">
        <h2>8. SQLite CRUD</h2>
        <p className="error">Failed to load SQLite: {error}</p>
      </section>
    )
  }
  return (
    <section className="card">
      <h2>8. SQLite CRUD</h2>
      <p className="muted">Real SQL in the browser via sql.js (WASM), persisted to localStorage.</p>

      {!ready ? (
        <p className="empty">Loading SQLite engine...</p>
      ) : (
        <>
          <form className="row" onSubmit={add}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" />
            <button type="submit" disabled={!title.trim()}>
              INSERT
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className="empty">No rows. Insert one above.</p>
          ) : (
            <ul className="list">
              {tasks.map((t) => (
                <li key={t.id} className="crud-row">
                  {editingId === t.id ? (
                    <>
                      <input value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus />
                      <span className="row">
                        <button onClick={() => saveEdit(t.id)}>UPDATE</button>
                        <button className="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        <span className="muted">#{t.id}</span> {t.title}
                      </span>
                      <span className="row">
                        <button
                          className="ghost"
                          onClick={() => {
                            setEditingId(t.id)
                            setDraft(t.title)
                          }}
                        >
                          Edit
                        </button>
                        <button className="danger" onClick={() => remove(t.id)}>
                          DELETE
                        </button>
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
