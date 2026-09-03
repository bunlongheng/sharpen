# React Interview Prep

Baby-step React practice - 5 exercises, each a real interview topic. Start at 1, work up to 5.

## The 5 steps

| Step | Topic | What you learn |
|------|-------|----------------|
| 1 | Button click | `useState`, event handlers, functional updates |
| 2 | Add to list | controlled input, immutable array updates, keys |
| 3 | CRUD | create / read / update / delete, edit-mode as UI state |
| 4 | Fetch API | `useEffect`, loading / error / data, cleanup + abort |
| 5 | Hooks + Context | custom hooks (reusable logic) + Context (global state) |

Each step has an **Interview notes** panel with the "gotchas" interviewers listen for.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5190

## Structure

```
src/
  App.jsx              # tab shell that switches between steps
  steps/               # one file per exercise (1-5)
  hooks/               # useLocalStorage - a reusable custom hook
  context/             # ThemeContext - global state via Context
```

## Next ideas (steps 6+)

- Debounced search / filter
- Forms with validation
- `useReducer` for complex state
- Performance: `React.memo`, `useCallback`, `useMemo`
- Routing with React Router
