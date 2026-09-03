# React Interview Prep

Baby-step React practice in **TypeScript** - 10 exercises, each a real interview topic. Start at 1,
work up to 10. Every step has heavily-commented code, an in-app "Interview notes" panel, and a
plain-English learning doc in [`docs/`](docs/README.md).

## The 10 steps

| # | Topic | What you learn | Doc |
|---|-------|----------------|-----|
| 1 | Button click | `useState`, event handlers, functional updates | [doc](docs/01-button-click.md) |
| 2 | Add to list | controlled input, immutable arrays, keys | [doc](docs/02-add-to-list.md) |
| 3 | CRUD | create / read / update / delete | [doc](docs/03-crud.md) |
| 4 | Fetch API | `useEffect`, loading / error / data, cleanup | [doc](docs/04-fetch-api.md) |
| 5 | Hooks + Context | custom hooks + global state | [doc](docs/05-hooks-context.md) |
| 6 | Auth0 | authentication as a service | [doc](docs/06-auth0.md) |
| 7 | Chart.js | 6 charts (bar, line, pie, doughnut, radar, polar) | [doc](docs/07-chartjs.md) |
| 8 | SQLite CRUD | real SQL in the browser via sql.js (WASM) | [doc](docs/08-sqlite-crud.md) |
| 9 | React Router | client-side routing + protected routes | [doc](docs/09-react-router.md) |
| 10 | Testing | Vitest + React Testing Library | [doc](docs/10-testing.md) |

## Run it (see the code AND the UI)

The whole point: **read the code in VS Code, see it live in Chrome.**

```bash
npm install
npm run dev
```

Then:
1. Open http://localhost:5190 in **Chrome** - click a step's tab to see the UI.
2. Open this folder in **VS Code** - the app shows the source file for each step (e.g.
   `src/steps/Step3Crud.tsx`); open that file to read the commented code.
3. Edit the code - the browser hot-reloads instantly. Break things, learn.

Read the matching [`docs/`](docs/README.md) file for the plain-English explanation of each step.

## Other commands

```bash
npm test          # run the test suite (step 10)
npm run test:watch # tests re-run as you edit
npm run typecheck # TypeScript check, no build
npm run build     # typecheck + production build
```

## Step 6 (Auth0) setup - optional

The app runs without it; Step 6 shows setup instructions until you add credentials. To see a real
login: copy `.env.example` to `.env`, fill in your Auth0 SPA domain + client id, restart.

## Structure

```
src/
  App.tsx              # tab shell that switches between steps + shows each step's source file
  steps/               # one file per exercise (Step1..Step10, all .tsx)
  steps/__tests__/     # Vitest + RTL tests
  hooks/               # useLocalStorage - a reusable custom hook
  context/             # ThemeContext - global state via Context
  auth/                # Auth0 provider wrapper
docs/                  # beginner-friendly walkthrough for every step
```

## Next ideas (steps 11+)

- Debounced search / filter
- Forms with validation (react-hook-form + zod)
- `useReducer` for complex state
- Performance: `React.memo`, `useCallback`, `useMemo`
- Data fetching with React Query / SWR
