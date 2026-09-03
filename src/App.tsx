import { useState, type ComponentType } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Auth0ProviderWrapper } from './auth/Auth0ProviderWrapper'
import CodeViewer from './CodeViewer'
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

// ?raw imports the file's SOURCE TEXT so we can show the real code in the browser (Vite feature).
import src1 from './steps/ButtonClick.tsx?raw'
import src2 from './steps/AddToList.tsx?raw'
import src3 from './steps/Crud.tsx?raw'
import src4 from './steps/FetchApi.tsx?raw'
import src5 from './steps/HooksContext.tsx?raw'
import src6 from './steps/Auth0.tsx?raw'
import src7 from './steps/Charts.tsx?raw'
import src8 from './steps/SqliteCrud.tsx?raw'
import src9 from './steps/Router.tsx?raw'
import src10 from './steps/Testing.tsx?raw'

interface StepDef {
  id: number
  label: string
  file: string // the source file - open this in VS Code to read the code behind the UI
  source: string // the file's raw source text, shown in the in-app code viewer
  Component: ComponentType
}

const STEPS: StepDef[] = [
  { id: 1, label: 'Button click', file: 'src/steps/ButtonClick.tsx', source: src1, Component: ButtonClick },
  { id: 2, label: 'Add to list', file: 'src/steps/AddToList.tsx', source: src2, Component: AddToList },
  { id: 3, label: 'CRUD', file: 'src/steps/Crud.tsx', source: src3, Component: Crud },
  { id: 4, label: 'Fetch API', file: 'src/steps/FetchApi.tsx', source: src4, Component: FetchApi },
  { id: 5, label: 'Hooks + Context', file: 'src/steps/HooksContext.tsx', source: src5, Component: HooksContext },
  { id: 6, label: 'Auth0', file: 'src/steps/Auth0.tsx', source: src6, Component: Auth0 },
  { id: 7, label: 'Chart.js', file: 'src/steps/Charts.tsx', source: src7, Component: Charts },
  { id: 8, label: 'SQLite CRUD', file: 'src/steps/SqliteCrud.tsx', source: src8, Component: SqliteCrud },
  { id: 9, label: 'React Router', file: 'src/steps/Router.tsx', source: src9, Component: Router },
  { id: 10, label: 'Testing', file: 'src/steps/Testing.tsx', source: src10, Component: Testing },
]

function Shell() {
  const [active, setActive] = useState(1)
  const { theme } = useTheme()
  const current = STEPS.find((s) => s.id === active)!
  const Current = current.Component

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>React Interview Prep</h1>
        <p className="muted">Baby steps 1 to 10 - each one is a real interview topic, written in TypeScript.</p>
      </header>

      <nav className="tabs">
        {STEPS.map((s) => (
          <button
            key={s.id}
            className={active === s.id ? 'tab active' : 'tab'}
            onClick={() => setActive(s.id)}
          >
            <span className="num">{s.id}</span> {s.label}
          </button>
        ))}
      </nav>

      {/* Tells you exactly which file to open in VS Code for the UI you're looking at */}
      <p className="filehint">📄 Code for this step: <code>{current.file}</code></p>

      {/* VSCode-in-the-browser: live result on the left, the real source code on the right */}
      <main className="split">
        <div className="split-result">
          <div className="split-label">Result</div>
          <Current />
        </div>
        <div className="split-code">
          <div className="split-label">Code</div>
          <CodeViewer file={current.file} source={current.source} />
        </div>
      </main>
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
