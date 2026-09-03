# Step 8: SQLite CRUD

**File:** `src/steps/Step8SqliteCrud.tsx`

## What you're building

The same CRUD list as Step 3 - but instead of a JS array, the data lives in a **real SQL database**
running inside your browser, and it survives page reloads.

## Wait, a database in the browser?

Yes. `sql.js` is SQLite (a full relational database) compiled to **WebAssembly (WASM)** so it runs
in the browser. You write actual SQL - `CREATE TABLE`, `INSERT`, `UPDATE`, `DELETE`, `SELECT` - with
no server at all. Great for learning SQL, prototypes, and offline apps.

## How it loads (the async part)

SQLite is a `.wasm` binary that must download and initialize before you can use it. That's why the
component has a `ready` state and shows "Loading SQLite engine..." first:

```tsx
const SQL = await initSqlJs({ locateFile: () => wasmUrl })
const db = new SQL.Database()
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)')
```

`wasmUrl` comes from `import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'` - Vite's `?url` gives us a
path to the binary so sql.js can find it.

## The four operations = four SQL statements

```tsx
db.run('INSERT INTO tasks (title) VALUES (?)', [value])          // Create
db.exec('SELECT id, title FROM tasks ORDER BY id')               // Read
db.run('UPDATE tasks SET title = ? WHERE id = ?', [value, id])   // Update
db.run('DELETE FROM tasks WHERE id = ?', [id])                   // Delete
```

After each write we call `refresh()`, which runs the SELECT and copies the rows into React state so
the UI updates.

## Two important lessons

### 1. Always use parameterized queries
See the `?` placeholders. **Never** build SQL by string concatenation with user input:

```tsx
// NEVER do this - SQL injection:
db.run(`INSERT INTO tasks (title) VALUES ('${value}')`)
// DO this:
db.run('INSERT INTO tasks (title) VALUES (?)', [value])
```

The `?` form lets SQLite handle escaping safely. This is a top security interview point.

### 2. The database is just bytes - persist it
An in-memory DB vanishes on reload. `db.export()` gives you the whole database as a byte array; we
JSON-stringify it into localStorage after every change, and reload it on startup:

```tsx
localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(db.export())))
```

## Try it yourself

1. Add a `done` column (`ALTER TABLE tasks ADD COLUMN done INTEGER DEFAULT 0`) and a checkbox.
2. Add a search box that runs `SELECT ... WHERE title LIKE ?`.
3. Add a "count" using `SELECT COUNT(*) FROM tasks`.

## Interview questions

- **What is sql.js?** SQLite compiled to WebAssembly - a real SQL database in the browser, no backend.
- **What's a parameterized query and why?** Using `?` placeholders instead of string concatenation -
  it prevents SQL injection.
- **How do you persist an in-browser DB?** Export it to bytes and store in localStorage/IndexedDB.
- **When is this NOT enough?** Multi-user or shared data - you still need a real server database; the
  browser DB is per-device.
