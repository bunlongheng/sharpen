// React concept notes per step (interview talking points).
// `backtick` spans render as inline code chips in the Notes panel.
export const INTERVIEW_NOTES: Record<number, string[]> = {
  1: [
    'State updates are asynchronous and batched. Use the functional form `setCount(c => c + 1)` when the new value depends on the old one.',
    'Calling the setter with the same value skips the re-render (bailout).',
    'The component function runs top-to-bottom on every render - keep it pure.',
  ],
  2: [
    'Controlled input = value comes from state, changes flow through `onChange`.',
    'Never mutate state arrays. Spread into a new array so React sees a new reference.',
    'Keys must be stable and unique. Array index breaks when items are inserted/removed/reordered.',
  ],
  3: [
    'Update: `map` and spread the one item you change - keep every other reference intact.',
    'Delete: `filter` out the id.',
    'Edit mode is just UI state (`editingId`). Don\'t store "am I editing" on each item.',
  ],
  4: [
    'Every fetch has 3 UI states: loading, error, success. Handle all 3.',
    'The dependency array controls when the effect re-runs. `[]` = once on mount.',
    'Clean up: an `ignore` flag or `AbortController` avoids "set state on unmounted component" and race conditions.',
    'In real apps, reach for React Query / SWR instead of hand-rolling this.',
  ],
  5: [
    'A custom hook is any function starting with `use` that calls other hooks. It shares logic, not state - each caller gets its own state.',
    'Context solves prop drilling. Provider at the top, `useContext` anywhere below.',
    'Context re-renders every consumer when its value changes - split contexts or memoize the value for performance.',
    'Context is not a full state manager. For heavy/global state reach for Redux, Zustand, or Jotai.',
  ],
  6: [
    '`Auth0Provider` wraps the tree; `useAuth0()` exposes session state and actions.',
    'SPAs use the Authorization Code flow with PKCE - no client secret in the browser.',
    'Never trust the client. Send the access token (`getAccessTokenSilently`) to your API and validate the JWT server-side.',
    'Gate UI on `isAuthenticated`; gate data/actions on the verified token, not the UI.',
  ],
  7: [
    'Chart.js v4 is tree-shakeable - register only the scales/elements each chart needs, or the chart renders blank.',
    'react-chartjs-2 is a thin wrapper: pass `data` and `options`, it manages the canvas lifecycle.',
    'Set `maintainAspectRatio: false` and size the parent so charts stay responsive.',
    'Keep data/options referentially stable (or memoize) to avoid needless chart rebuilds.',
  ],
  8: [
    'sql.js = SQLite compiled to WebAssembly - a full relational DB with zero backend.',
    'Always use parameterized queries (`?` placeholders) - string-concatenating input is SQL injection.',
    'The DB is a byte array (`db.export()`); persist it (localStorage/IndexedDB) or it vanishes on reload.',
    'Great for prototypes/offline; for multi-user data you still need a real server DB.',
  ],
  9: [
    '`BrowserRouter` uses the History API (clean URLs); `MemoryRouter` keeps history in memory (tests, embedded demos).',
    'Protected routes = a wrapper component that checks auth and `<Navigate>`s away if not allowed.',
    'Pass the attempted path via state so you can send the user back after login.',
    '`useNavigate` for programmatic navigation; `useParams` / `useSearchParams` for reading the URL.',
  ],
  10: [
    'Query by role/text (`getByRole`, `getByText`) - it mirrors how users and screen readers find things.',
    '`getBy*` throws if missing, `queryBy*` returns null (assert absence), `findBy*` is async (awaits appearance).',
    'Prefer `userEvent` over `fireEvent` for realistic interactions.',
    'Test what the user sees and does; avoid asserting on state or internal function calls.',
  ],
}

// What TypeScript adds over plain JavaScript, per React step.
// Shown under the JS-vs-TS comparison so you can spot exactly what the types buy you.
export const DIFF_NOTES: Record<number, string[]> = {
  1: [
    '`useState(0)` - TS infers `count` is a number automatically; no annotation needed.',
    'TS would reject `setCount("x")` at compile time; JS would silently break at runtime.',
    'Takeaway: even with zero annotations, TS is already type-checking via inference.',
  ],
  2: [
    '`interface Item { id: string; value: string }` - names the shape; JS has no such contract.',
    '`useState<Item[]>([])` types the list; JS is just `useState([])` (element type unknown).',
    '`e: FormEvent<HTMLFormElement>` types the event; JS leaves `e` as any.',
  ],
  3: [
    '`interface Item` + `useState<Item[]>` type the data.',
    '`useState<string | null>(null)` makes "which row is editing" an explicit id-or-null.',
    'Function params are typed: `remove(id: string)`, `startEdit(item: Item)`, `saveEdit(id: string)`.',
  ],
  4: [
    '`interface Weather` types the API response; `useState<Weather | null>` and `useState<string | null>` type the 3 states.',
    '`const data = (await res.json()) as { current: Weather }` - casts untyped JSON to a known shape.',
    '`(err as Error).message` - caught errors are `unknown` in TS, so you narrow before use.',
    '`describe(code: number): string` - typed params + return on the weather-code mapper.',
  ],
  5: [
    '`useLocalStorage<string>(...)` passes the value type in; JS drops the generic.',
    'The hook itself is generic `<T>` (see `hooks/useLocalStorage.ts`) so every caller stays typed.',
    'The Theme context value is typed `{ theme, toggle }` (see `context/ThemeContext.tsx`).',
  ],
  6: [
    'Here the types come mostly from the library: `useAuth0()` returns fully-typed session + actions.',
    '`user?.name` is safely optional-chained because the `User` type marks fields as possibly undefined.',
    'In-file the JS and TS look nearly identical - the safety lives in the typed SDK.',
  ],
  7: [
    '`options ... as const` freezes the object into literal types (e.g. legend position is exact).',
    'Chart data/options are largely inferred, so JS and TS look close here.',
    'react-chartjs-2 + chart.js ship their own types, so datasets are checked against the lib.',
  ],
  8: [
    '`interface Task` types the rows; `useRef<Database | null>(null)` types the DB handle.',
    '`import initSqlJs, { type Database }` - a type-only import, erased at build time.',
    'Query results are mapped into typed `Task` objects; params are typed (`id: number`, etc.).',
  ],
  9: [
    'type import `ReactNode` types the children prop.',
    '`RequireAuth` props are typed: `{ authed: boolean; children: ReactNode }` - misuse is caught.',
    'Route element props from react-router-dom are typed by the library.',
  ],
  10: [
    'The test uses typed `render`/`screen` from @testing-library/react.',
    'Component props are checked in JSX, so a wrong prop fails the test file at compile time.',
    'Vitest + TS gives autocomplete on `expect(...)` matchers.',
  ],
}
