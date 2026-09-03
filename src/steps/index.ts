import { lazy, type ComponentType } from 'react'
import {
  MousePointerClick,
  ListPlus,
  ClipboardList,
  Globe,
  Webhook,
  KeyRound,
  BarChart3,
  Database,
  Route,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react'

export interface ReactStep {
  id: number
  label: string
  Icon: LucideIcon
  blurb: string
  name: string // base file name without extension
  Component: ComponentType
  loadSource: () => Promise<{ ts: string; js: string }>
}

// Source text (?raw) is fetched on demand per step instead of riding in the entry bundle -
// raw strings barely minify, so keeping them out of the main chunk is the cheapest win.
const tsRaw = import.meta.glob('./*.tsx', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>
const jsRaw = import.meta.glob('../steps-js/*.jsx', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

function loadSource(name: string) {
  return async () => {
    const [ts, js] = await Promise.all([tsRaw[`./${name}.tsx`](), jsRaw[`../steps-js/${name}.jsx`]()])
    return { ts, js }
  }
}

// Each step is its own lazy chunk, so heavy deps like chart.js and sql.js only download when opened.
const step = (
  id: number,
  label: string,
  Icon: LucideIcon,
  blurb: string,
  name: string,
  load: () => Promise<{ default: ComponentType }>,
): ReactStep => ({ id, label, Icon, blurb, name, Component: lazy(load), loadSource: loadSource(name) })

export const REACT_STEPS: ReactStep[] = [
  step(
    1,
    'Button click',
    MousePointerClick,
    'useState and event handlers',
    'ButtonClick',
    () => import('./ButtonClick'),
  ),
  step(
    2,
    'Add to list',
    ListPlus,
    'controlled inputs, immutable updates, keys',
    'AddToList',
    () => import('./AddToList'),
  ),
  step(3, 'CRUD', ClipboardList, 'create, read, update, delete a list', 'Crud', () => import('./Crud')),
  step(4, 'Fetch API', Globe, 'useEffect with loading, error, data', 'FetchApi', () => import('./FetchApi')),
  step(
    5,
    'Hooks + Context',
    Webhook,
    'custom hooks and global state',
    'HooksContext',
    () => import('./HooksContext'),
  ),
  step(6, 'Auth0', KeyRound, 'authentication as a service', 'Auth0', () => import('./Auth0')),
  step(7, 'Chart.js', BarChart3, 'wrapping a canvas chart library', 'Charts', () => import('./Charts')),
  step(
    8,
    'SQLite CRUD',
    Database,
    'real SQL in the browser via WASM',
    'SqliteCrud',
    () => import('./SqliteCrud'),
  ),
  step(
    9,
    'React Router',
    Route,
    'client-side routing and protected routes',
    'Router',
    () => import('./Router'),
  ),
  step(10, 'Testing', FlaskConical, 'Vitest and React Testing Library', 'Testing', () => import('./Testing')),
]
