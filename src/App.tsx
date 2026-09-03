import { useState, type ComponentType } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Auth0ProviderWrapper } from './auth/Auth0ProviderWrapper'
import CodeViewer from './CodeViewer'
import TsRunner from './TsRunner'
import { DIFF_NOTES } from './diffNotes'

// --- React track: components ---
import ButtonClick from './steps/ButtonClick'
import AddToList from './steps/AddToList'
import Crud from './steps/Crud'
import FetchApi from './steps/FetchApi'
import HooksContext from './steps/HooksContext'
import Auth0 from './steps/Auth0'
import Charts from './steps/Charts'
import SqliteCrud from './steps/SqliteCrud'
import Router from './steps/Router'
import Testing from './steps/Testing'

// --- React track: TS + JS source text (?raw) ---
import ts1 from './steps/ButtonClick.tsx?raw'
import ts2 from './steps/AddToList.tsx?raw'
import ts3 from './steps/Crud.tsx?raw'
import ts4 from './steps/FetchApi.tsx?raw'
import ts5 from './steps/HooksContext.tsx?raw'
import ts6 from './steps/Auth0.tsx?raw'
import ts7 from './steps/Charts.tsx?raw'
import ts8 from './steps/SqliteCrud.tsx?raw'
import ts9 from './steps/Router.tsx?raw'
import ts10 from './steps/Testing.tsx?raw'
import js1 from './steps-js/ButtonClick.jsx?raw'
import js2 from './steps-js/AddToList.jsx?raw'
import js3 from './steps-js/Crud.jsx?raw'
import js4 from './steps-js/FetchApi.jsx?raw'
import js5 from './steps-js/HooksContext.jsx?raw'
import js6 from './steps-js/Auth0.jsx?raw'
import js7 from './steps-js/Charts.jsx?raw'
import js8 from './steps-js/SqliteCrud.jsx?raw'
import js9 from './steps-js/Router.jsx?raw'
import js10 from './steps-js/Testing.jsx?raw'

// --- TypeScript track: run() functions + source text ---
import { run as tsr1 } from './ts/HelloWorld'
import { run as tsr2 } from './ts/InterfacesTypes'
import { run as tsr3 } from './ts/UnionsNarrowing'
import { run as tsr4 } from './ts/ArraysTuplesEnums'
import { run as tsr5 } from './ts/Generics'
import { run as tsr6 } from './ts/Functions'
import { run as tsr7 } from './ts/UtilityTypes'
import { run as tsr8 } from './ts/Classes'
import { run as tsr9 } from './ts/AdvancedTypes'
import { run as tsr10 } from './ts/AsyncAwait'
import tsc1 from './ts/HelloWorld.ts?raw'
import tsc2 from './ts/InterfacesTypes.ts?raw'
import tsc3 from './ts/UnionsNarrowing.ts?raw'
import tsc4 from './ts/ArraysTuplesEnums.ts?raw'
import tsc5 from './ts/Generics.ts?raw'
import tsc6 from './ts/Functions.ts?raw'
import tsc7 from './ts/UtilityTypes.ts?raw'
import tsc8 from './ts/Classes.ts?raw'
import tsc9 from './ts/AdvancedTypes.ts?raw'
import tsc10 from './ts/AsyncAwait.ts?raw'

interface ReactStep {
  id: number
  label: string
  icon: string
  blurb: string
  name: string // base file name without extension
  tsSource: string
  jsSource: string
  Component: ComponentType
}

interface TsStep {
  id: number
  label: string
  icon: string
  blurb: string
  file: string
  source: string
  run: () => void | Promise<void>
}

const REACT_STEPS: ReactStep[] = [
  { id: 1, label: 'Button click', icon: '🔘', blurb: 'useState and event handlers', name: 'ButtonClick', tsSource: ts1, jsSource: js1, Component: ButtonClick },
  { id: 2, label: 'Add to list', icon: '➕', blurb: 'controlled inputs, immutable updates, keys', name: 'AddToList', tsSource: ts2, jsSource: js2, Component: AddToList },
  { id: 3, label: 'CRUD', icon: '🗂️', blurb: 'create, read, update, delete a list', name: 'Crud', tsSource: ts3, jsSource: js3, Component: Crud },
  { id: 4, label: 'Fetch API', icon: '🌐', blurb: 'useEffect with loading, error, data', name: 'FetchApi', tsSource: ts4, jsSource: js4, Component: FetchApi },
  { id: 5, label: 'Hooks + Context', icon: '🪝', blurb: 'custom hooks and global state', name: 'HooksContext', tsSource: ts5, jsSource: js5, Component: HooksContext },
  { id: 6, label: 'Auth0', icon: '🔐', blurb: 'authentication as a service', name: 'Auth0', tsSource: ts6, jsSource: js6, Component: Auth0 },
  { id: 7, label: 'Chart.js', icon: '📊', blurb: 'wrapping a canvas chart library', name: 'Charts', tsSource: ts7, jsSource: js7, Component: Charts },
  { id: 8, label: 'SQLite CRUD', icon: '🗄️', blurb: 'real SQL in the browser via WASM', name: 'SqliteCrud', tsSource: ts8, jsSource: js8, Component: SqliteCrud },
  { id: 9, label: 'React Router', icon: '🧭', blurb: 'client-side routing and protected routes', name: 'Router', tsSource: ts9, jsSource: js9, Component: Router },
  { id: 10, label: 'Testing', icon: '🧪', blurb: 'Vitest and React Testing Library', name: 'Testing', tsSource: ts10, jsSource: js10, Component: Testing },
]

const TS_STEPS: TsStep[] = [
  { id: 1, label: 'Hello World', icon: '👋', blurb: 'types, inference, functions', file: 'HelloWorld.ts', source: tsc1, run: tsr1 },
  { id: 2, label: 'Interfaces & Types', icon: '🧩', blurb: 'object shapes, optional, readonly', file: 'InterfacesTypes.ts', source: tsc2, run: tsr2 },
  { id: 3, label: 'Unions & Narrowing', icon: '🔀', blurb: 'discriminated unions, type guards', file: 'UnionsNarrowing.ts', source: tsc3, run: tsr3 },
  { id: 4, label: 'Arrays, Tuples, Enums', icon: '📚', blurb: 'collections and constants', file: 'ArraysTuplesEnums.ts', source: tsc4, run: tsr4 },
  { id: 5, label: 'Generics', icon: '🧬', blurb: 'reusable, type-safe code', file: 'Generics.ts', source: tsc5, run: tsr5 },
  { id: 6, label: 'Functions', icon: '⚙️', blurb: 'overloads, rest params, callbacks', file: 'Functions.ts', source: tsc6, run: tsr6 },
  { id: 7, label: 'Utility Types', icon: '🛠️', blurb: 'Partial, Pick, Omit, Record', file: 'UtilityTypes.ts', source: tsc7, run: tsr7 },
  { id: 8, label: 'Classes', icon: '🏛️', blurb: 'modifiers, abstract, implements', file: 'Classes.ts', source: tsc8, run: tsr8 },
  { id: 9, label: 'Advanced Types', icon: '🧠', blurb: 'keyof, mapped, conditional, infer', file: 'AdvancedTypes.ts', source: tsc9, run: tsr9 },
  { id: 10, label: 'Async', icon: '⏳', blurb: 'promises, async/await, error handling', file: 'AsyncAwait.ts', source: tsc10, run: tsr10 },
]

function StepPicker({ steps, active, onPick }: { steps: { id: number; label: string; icon: string }[]; active: number; onPick: (id: number) => void }) {
  return (
    <select className="dd dd-step" value={active} onChange={(e) => onPick(Number(e.target.value))} aria-label="Choose lesson">
      {steps.map((s) => (
        <option key={s.id} value={s.id}>{s.icon} {s.id}. {s.label}</option>
      ))}
    </select>
  )
}

function ReactView({ step }: { step: ReactStep }) {
  const Current = step.Component
  return (
    <>
      <div className="split-label">Result</div>
      <div className="result-card"><Current /></div>

      <div className="split-label" style={{ marginTop: 24 }}>TypeScript vs JavaScript - spot the difference</div>
      <div className="compare">
        <div>
          <div className="lang-tag ts">TypeScript</div>
          <CodeViewer file={`${step.name}.tsx`} source={step.tsSource} />
        </div>
        <div>
          <div className="lang-tag js">JavaScript</div>
          <CodeViewer file={`${step.name}.jsx`} source={step.jsSource} />
        </div>
      </div>

      <div className="diffnotes">
        <div className="diffnotes-title">What TypeScript adds here</div>
        <ul>
          {(DIFF_NOTES[step.id] ?? []).map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

function TsView({ step }: { step: TsStep }) {
  return (
    <main className="split">
      <div className="split-result">
        <div className="split-label">Output</div>
        <TsRunner run={step.run} />
      </div>
      <div className="split-code">
        <div className="split-label">Code</div>
        <CodeViewer file={step.file} source={step.source} />
      </div>
    </main>
  )
}

function Shell() {
  const { theme } = useTheme()
  const [track, setTrack] = useState<'react' | 'ts'>('react')
  const [reactActive, setReactActive] = useState(1)
  const [tsActive, setTsActive] = useState(1)

  const reactStep = REACT_STEPS.find((s) => s.id === reactActive)!
  const tsStep = TS_STEPS.find((s) => s.id === tsActive)!
  const cur = track === 'react' ? reactStep : tsStep

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div>
          <h1>Interview Preps</h1>
          <p className="muted">{cur.icon} {cur.label} - {cur.blurb}</p>
        </div>
        <div className="controls">
          <select className="dd dd-track" value={track} onChange={(e) => setTrack(e.target.value as 'react' | 'ts')} aria-label="Choose track">
            <option value="react">⚛️ React</option>
            <option value="ts">🔷 TypeScript</option>
          </select>
          {track === 'react'
            ? <StepPicker steps={REACT_STEPS} active={reactActive} onPick={setReactActive} />
            : <StepPicker steps={TS_STEPS} active={tsActive} onPick={setTsActive} />}
        </div>
      </header>

      {track === 'react' ? <ReactView step={reactStep} /> : <TsView step={tsStep} />}
    </div>
  )
}

export default function App() {
  return (
    <Auth0ProviderWrapper>
      <ThemeProvider>
        <Shell />
      </ThemeProvider>
    </Auth0ProviderWrapper>
  )
}
