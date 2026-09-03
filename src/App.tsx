import { useState, type ComponentType } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Auth0ProviderWrapper } from './auth/Auth0ProviderWrapper'
import CodeViewer from './CodeViewer'
import Step1ButtonClick from './steps/Step1ButtonClick'
import Step2AddToList from './steps/Step2AddToList'
import Step3Crud from './steps/Step3Crud'
import Step4FetchApi from './steps/Step4FetchApi'
import Step5HooksContext from './steps/Step5HooksContext'
import Step6Auth0 from './steps/Step6Auth0'
import Step7Charts from './steps/Step7Charts'
import Step8SqliteCrud from './steps/Step8SqliteCrud'
import Step9Router from './steps/Step9Router'
import Step10Testing from './steps/Step10Testing'

// ?raw imports the file's SOURCE TEXT so we can show the real code in the browser (Vite feature).
import src1 from './steps/Step1ButtonClick.tsx?raw'
import src2 from './steps/Step2AddToList.tsx?raw'
import src3 from './steps/Step3Crud.tsx?raw'
import src4 from './steps/Step4FetchApi.tsx?raw'
import src5 from './steps/Step5HooksContext.tsx?raw'
import src6 from './steps/Step6Auth0.tsx?raw'
import src7 from './steps/Step7Charts.tsx?raw'
import src8 from './steps/Step8SqliteCrud.tsx?raw'
import src9 from './steps/Step9Router.tsx?raw'
import src10 from './steps/Step10Testing.tsx?raw'

interface StepDef {
  id: number
  label: string
  file: string // the source file - open this in VS Code to read the code behind the UI
  source: string // the file's raw source text, shown in the in-app code viewer
  Component: ComponentType
}

const STEPS: StepDef[] = [
  { id: 1, label: 'Button click', file: 'src/steps/Step1ButtonClick.tsx', source: src1, Component: Step1ButtonClick },
  { id: 2, label: 'Add to list', file: 'src/steps/Step2AddToList.tsx', source: src2, Component: Step2AddToList },
  { id: 3, label: 'CRUD', file: 'src/steps/Step3Crud.tsx', source: src3, Component: Step3Crud },
  { id: 4, label: 'Fetch API', file: 'src/steps/Step4FetchApi.tsx', source: src4, Component: Step4FetchApi },
  { id: 5, label: 'Hooks + Context', file: 'src/steps/Step5HooksContext.tsx', source: src5, Component: Step5HooksContext },
  { id: 6, label: 'Auth0', file: 'src/steps/Step6Auth0.tsx', source: src6, Component: Step6Auth0 },
  { id: 7, label: 'Chart.js', file: 'src/steps/Step7Charts.tsx', source: src7, Component: Step7Charts },
  { id: 8, label: 'SQLite CRUD', file: 'src/steps/Step8SqliteCrud.tsx', source: src8, Component: Step8SqliteCrud },
  { id: 9, label: 'React Router', file: 'src/steps/Step9Router.tsx', source: src9, Component: Step9Router },
  { id: 10, label: 'Testing', file: 'src/steps/Step10Testing.tsx', source: src10, Component: Step10Testing },
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
