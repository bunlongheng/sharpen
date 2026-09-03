import { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Step1ButtonClick from './steps/Step1ButtonClick'
import Step2AddToList from './steps/Step2AddToList'
import Step3Crud from './steps/Step3Crud'
import Step4FetchApi from './steps/Step4FetchApi'
import Step5HooksContext from './steps/Step5HooksContext'

const STEPS = [
  { id: 1, label: 'Button click', Component: Step1ButtonClick },
  { id: 2, label: 'Add to list', Component: Step2AddToList },
  { id: 3, label: 'CRUD', Component: Step3Crud },
  { id: 4, label: 'Fetch API', Component: Step4FetchApi },
  { id: 5, label: 'Hooks + Context', Component: Step5HooksContext },
]

function Shell() {
  const [active, setActive] = useState(1)
  const { theme } = useTheme()
  const Current = STEPS.find((s) => s.id === active).Component

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>React Interview Prep</h1>
        <p className="muted">Baby steps 1 to 5 - each one is a real interview topic.</p>
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

      <main>
        <Current />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  )
}
