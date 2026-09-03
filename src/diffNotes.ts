// What TypeScript adds over plain JavaScript, per React step.
// Shown under the JS-vs-TS comparison so you can spot exactly what the types buy you.
export const DIFF_NOTES: Record<number, string[]> = {
  1: [
    'useState(0) - TS infers `count` is a number automatically; no annotation needed.',
    'TS would reject setCount("x") at compile time; JS would silently break at runtime.',
    'Takeaway: even with zero annotations, TS is already type-checking via inference.',
  ],
  2: [
    'interface Item { id: string; value: string } - names the shape; JS has no such contract.',
    'useState<Item[]>([]) types the list; JS is just useState([]) (element type unknown).',
    'e: FormEvent<HTMLFormElement> types the event; JS leaves `e` as any.',
  ],
  3: [
    'interface Item + useState<Item[]> type the data.',
    'useState<string | null>(null) makes "which row is editing" an explicit id-or-null.',
    'Function params are typed: remove(id: string), startEdit(item: Item), saveEdit(id: string).',
  ],
  4: [
    'interface User types the API response; useState<User[]> and useState<string | null> type the 3 states.',
    'const data = (await res.json()) as User[] - casts untyped JSON to a known shape.',
    '(err as Error).message - caught errors are `unknown` in TS, so you narrow before use.',
  ],
  5: [
    'useLocalStorage<string>(...) passes the value type in; JS drops the generic.',
    'The hook itself is generic <T> (see hooks/useLocalStorage.ts) so every caller stays typed.',
    'The Theme context value is typed { theme, toggle } (see context/ThemeContext.tsx).',
  ],
  6: [
    'Here the types come mostly from the library: useAuth0() returns fully-typed session + actions.',
    'user?.name is safely optional-chained because the User type marks fields as possibly undefined.',
    'In-file the JS and TS look nearly identical - the safety lives in the typed SDK.',
  ],
  7: [
    'options ... as const freezes the object into literal types (e.g. legend position is exact).',
    'Chart data/options are largely inferred, so JS and TS look close here.',
    'react-chartjs-2 + chart.js ship their own types, so datasets are checked against the lib.',
  ],
  8: [
    'interface Task types the rows; useRef<Database | null>(null) types the DB handle.',
    "import initSqlJs, { type Database } - a type-only import, erased at build time.",
    'Query results are mapped into typed Task objects; params are typed (id: number, etc.).',
  ],
  9: [
    'type import ReactNode types the children prop.',
    'RequireAuth props are typed: { authed: boolean; children: ReactNode } - misuse is caught.',
    'Route element props from react-router-dom are typed by the library.',
  ],
  10: [
    'The test uses typed render/screen from @testing-library/react.',
    'Component props are checked in JSX, so a wrong prop fails the test file at compile time.',
    'Vitest + TS gives autocomplete on expect(...) matchers.',
  ],
}
