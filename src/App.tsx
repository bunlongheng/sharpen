import { Fragment, lazy, Suspense, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { FontProvider } from './FontContext'
import { isAuth0Configured } from './auth/config'
import TsRunner from './TsRunner'
import Dropdown from './Dropdown'
import { ReactLogo, TsLogo, JsLogo } from './Logos'
import { DIFF_NOTES, INTERVIEW_NOTES } from './diffNotes'
import ErrorBoundary from './ErrorBoundary'
import { REACT_STEPS, type ReactStep } from './steps'
import { TS_STEPS, type TsStep } from './ts'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useLoaded } from './hooks/useLoaded'
import { useHashRoute, type Track } from './hooks/useHashRoute'

// Prism (syntax highlighting) is its own chunk. Kick the download off immediately so it lands in
// parallel with the step + source chunks instead of one round trip behind them; lazy() still only
// suspends where a CodeViewer actually renders, so the shell paints first.
const codeViewerChunk = import('./CodeViewer')
codeViewerChunk.catch(() => {}) // no unhandled-rejection noise; lazy() below still reports a failed load
const CodeViewer = lazy(() => codeViewerChunk)

// The Auth0 provider (and the SDK at the root) only mounts when the app is configured for it.
// Step 6's own chunk still carries the SDK for its demo - the lesson is about showing useAuth0.
const Auth0Root: ComponentType<{ children: ReactNode }> = isAuth0Configured
  ? lazy(() => import('./auth/Auth0ProviderWrapper'))
  : Fragment

const STEP_COUNTS = { react: REACT_STEPS.length, ts: TS_STEPS.length }

const Loading = () => (
  <section className="card">
    <p className="empty">Loading...</p>
  </section>
)

function Compare({ step }: { step: ReactStep }) {
  const narrow = useMediaQuery('(max-width: 860px)')
  const [lang, setLang] = useState<'ts' | 'js'>('ts')
  const src = useLoaded(step.loadSource)
  if (!src) return <Loading />

  // On phone/iPad: TS/JS become tabs (one at a time) so the code isn't a mile of scroll.
  if (narrow) {
    return (
      <div className="compare-stack">
        <div className="lang-switch">
          <button className={lang === 'ts' ? 'lang-tab ts on' : 'lang-tab'} onClick={() => setLang('ts')}>
            <TsLogo size={16} /> TypeScript
          </button>
          <button className={lang === 'js' ? 'lang-tab js on' : 'lang-tab'} onClick={() => setLang('js')}>
            <JsLogo size={16} /> JavaScript
          </button>
        </div>
        {lang === 'ts' ? (
          <CodeViewer file={`${step.name}.tsx`} source={src.ts} variant="ts" />
        ) : (
          <CodeViewer file={`${step.name}.jsx`} source={src.js} variant="js" />
        )}
      </div>
    )
  }

  // Desktop: side by side to spot the difference.
  return (
    <div className="compare">
      <CodeViewer file={`${step.name}.tsx`} source={src.ts} variant="ts" />
      <CodeViewer file={`${step.name}.jsx`} source={src.js} variant="js" />
    </div>
  )
}

// `backtick` spans in a note render as Notion-style inline code
export function renderNote(text: string) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} className="note-code">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  )
}

function ReactView({ step }: { step: ReactStep }) {
  const Current = step.Component
  return (
    <>
      <main className="react-top">
        <div className="result-col">
          <div className="split-label">Result</div>
          <div className="result-card tv">
            <i className="tv-antenna" aria-hidden="true" />
            <div className="tv-body">
              <div className="tv-screen">
                {/* key={step.id} remounts the boundary per step, so a crash in one step never sticks to the next */}
                <ErrorBoundary key={step.id}>
                  <Suspense fallback={<Loading />}>
                    <Current />
                  </Suspense>
                </ErrorBoundary>
              </div>
              <div className="tv-side" aria-hidden="true">
                <i className="tv-knob" />
                <i className="tv-knob" />
                <span className="tv-grille" />
                <span className="tv-brand">
                  SHARPEN
                  <i className="tv-led" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="notes-col">
          <div className="split-label">Notes</div>
          <div className="notepad">
            <div className="diffnotes">
              <div className="notes-sub">Notes</div>
              <ul>
                {[...(INTERVIEW_NOTES[step.id] ?? []), ...(DIFF_NOTES[step.id] ?? [])].map((n, i) => (
                  <li key={i}>{renderNote(n)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <div className="compare-wrap">
        <ErrorBoundary key={step.id}>
          <Suspense fallback={<Loading />}>
            <Compare step={step} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}

function TsView({ step }: { step: TsStep }) {
  const data = useLoaded(step.load)
  return (
    <main className="split">
      <div className="split-code">
        <div className="split-head">
          <span className="split-label">Code</span>
        </div>
        <Suspense fallback={<Loading />}>
          {data ? <CodeViewer file={step.file} source={data.source} /> : <Loading />}
        </Suspense>
      </div>
      <div className="split-result">
        <div className="split-label">Output</div>
        {data ? <TsRunner run={data.run} /> : <Loading />}
      </div>
    </main>
  )
}

// Root fallback (only visible while a configured Auth0 provider chunk loads) stays themed.
function ShellFallback() {
  const { theme } = useTheme()
  return (
    <div className={`app ${theme}`}>
      <Loading />
    </div>
  )
}

function Shell() {
  const { theme, toggle } = useTheme()
  const { route, setRoute, setTrack } = useHashRoute(STEP_COUNTS)

  const { track, step: active } = route
  const steps = track === 'react' ? REACT_STEPS : TS_STEPS
  const cur = steps.find((s) => s.id === active)!
  const CurIcon = cur.Icon
  const total = steps.length

  const setActive = (n: number) => setRoute({ track, step: n })
  const go = (delta: number) => setActive(Math.min(total, Math.max(1, active + delta)))

  const trackOptions = useMemo(
    () => [
      { value: 'react', label: 'React', Icon: ReactLogo },
      { value: 'ts', label: 'TypeScript', Icon: TsLogo },
    ],
    [],
  )
  const stepOptions = steps.map((s) => ({ value: s.id, label: `${s.id}. ${s.label}`, Icon: s.Icon }))

  return (
    <div className={`app ${theme} track-${track}`}>
      <header className="app-header">
        <div className="header-titles">
          <h1 className="brand">
            <img
              className="brand-logo"
              src={`${import.meta.env.BASE_URL}icon-64.png`}
              alt=""
              width={34}
              height={34}
            />
            Sharpen
          </h1>
          <p className="muted subtitle">
            <CurIcon size={14} strokeWidth={2} /> {cur.label} - {cur.blurb}
          </p>
        </div>
        <div className="controls">
          <div className="track-row">
            <Dropdown
              options={trackOptions}
              value={track}
              onChange={(v) => setTrack(v as Track)}
              minWidth={140}
              ariaLabel="Choose track"
            />
            <button
              className="navbtn"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <div className="step-nav">
            <button
              className="navbtn"
              onClick={() => go(-1)}
              disabled={active <= 1}
              aria-label="Previous lesson"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <Dropdown
              options={stepOptions}
              value={active}
              onChange={(v) => setActive(Number(v))}
              minWidth={200}
              ariaLabel="Choose lesson"
            />
            <button
              className="navbtn"
              onClick={() => go(1)}
              disabled={active >= total}
              aria-label="Next lesson"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
            <span className="step-count">
              {active} / {total}
            </span>
          </div>
        </div>
      </header>

      {track === 'react' ? (
        <ReactView step={cur as ReactStep} />
      ) : (
        <ErrorBoundary key={`ts-${active}`}>
          <TsView step={cur as TsStep} />
        </ErrorBoundary>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <FontProvider>
        <ErrorBoundary>
          <Suspense fallback={<ShellFallback />}>
            <Auth0Root>
              <Shell />
            </Auth0Root>
          </Suspense>
        </ErrorBoundary>
      </FontProvider>
    </ThemeProvider>
  )
}
