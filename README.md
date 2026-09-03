# Sharpen

Sharpen your interview skills. Two practice tracks in one app - **React** and **TypeScript** - each
step a real interview topic, with a live result, the real source code, and notes. Toggle tracks in
the header.

![Sharpen - live result, side-by-side TypeScript vs JavaScript, and handwritten notes](docs/demo.png)

## Run it

```bash
npm install
npm run dev        # http://localhost:5190
```

Then open the folder in VS Code and the app in Chrome side by side.

## React track (10 steps)

Each step shows the **live result**, the code as **TypeScript vs JavaScript side-by-side** (spot the
difference), and a "what TypeScript adds here" notes box.

| # | Topic | File |
|---|-------|------|
| 1 | Button click | `src/steps/ButtonClick.tsx` |
| 2 | Add to list | `src/steps/AddToList.tsx` |
| 3 | CRUD | `src/steps/Crud.tsx` |
| 4 | Fetch API | `src/steps/FetchApi.tsx` |
| 5 | Hooks + Context | `src/steps/HooksContext.tsx` |
| 6 | Auth0 | `src/steps/Auth0.tsx` |
| 7 | Chart.js | `src/steps/Charts.tsx` |
| 8 | SQLite CRUD | `src/steps/SqliteCrud.tsx` |
| 9 | React Router | `src/steps/Router.tsx` |
| 10 | Testing | `src/steps/Testing.tsx` |

JS versions are generated in `src/steps-js/` (types stripped, JSX kept). Deep-dive docs in
[`docs/`](docs/README.md).

## TypeScript track (10 steps)

Language fundamentals from hello world to advanced types. Each step **runs in the browser** and prints
its console output next to the code.

| # | Topic | File |
|---|-------|------|
| 1 | Hello World | `src/ts/HelloWorld.ts` |
| 2 | Interfaces & Types | `src/ts/InterfacesTypes.ts` |
| 3 | Unions & Narrowing | `src/ts/UnionsNarrowing.ts` |
| 4 | Arrays, Tuples, Enums | `src/ts/ArraysTuplesEnums.ts` |
| 5 | Generics | `src/ts/Generics.ts` |
| 6 | Functions | `src/ts/Functions.ts` |
| 7 | Utility Types | `src/ts/UtilityTypes.ts` |
| 8 | Classes | `src/ts/Classes.ts` |
| 9 | Advanced Types | `src/ts/AdvancedTypes.ts` |
| 10 | Async | `src/ts/AsyncAwait.ts` |

## Commands

```bash
npm test          # Vitest + React Testing Library
npm run typecheck # tsc --noEmit
npm run build     # typecheck + production build
```

## Code viewer

- **TS vs JS side-by-side** - per-language editor themes (blue for TypeScript, sand for JavaScript).
- **Copy** - copy the shown code.
- Font size adapts to screen width (phone through desktop).
