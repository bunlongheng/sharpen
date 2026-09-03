# Learning Docs

A plain-English walkthrough for each step, written for someone new to React. Each doc explains
**what** you're building, the **new idea** it introduces, a **code walkthrough**, **try-it-yourself**
exercises, and the **interview questions** you'd be asked on that topic.

Read them in order alongside the running app (`npm run dev` -> http://localhost:5190). Each step's tab
in the app tells you which source file it maps to.

| # | Doc | Topic |
|---|-----|-------|
| 1 | [01-button-click.md](01-button-click.md) | useState + event handlers |
| 2 | [02-add-to-list.md](02-add-to-list.md) | controlled inputs, immutable updates, keys |
| 3 | [03-crud.md](03-crud.md) | create / read / update / delete |
| 4 | [04-fetch-api.md](04-fetch-api.md) | useEffect, loading / error / data, cleanup |
| 5 | [05-hooks-context.md](05-hooks-context.md) | custom hooks + Context |
| 6 | [06-auth0.md](06-auth0.md) | authentication as a service |
| 7 | [07-chartjs.md](07-chartjs.md) | Chart.js - 6 chart types |
| 8 | [08-sqlite-crud.md](08-sqlite-crud.md) | real SQL in the browser (sql.js) |
| 9 | [09-react-router.md](09-react-router.md) | client-side routing + protected routes |
| 10 | [10-testing.md](10-testing.md) | Vitest + React Testing Library |

## How to study

1. Open the app in Chrome and this repo in VS Code, side by side.
2. Click a step's tab in Chrome to see the UI.
3. Open the matching doc here to understand the concept.
4. Open the file named in the step table (e.g. `src/steps/Crud.tsx`) to read the real code (it's heavily commented).
5. Do the "Try it yourself" exercises - change the code, watch the browser hot-reload.
