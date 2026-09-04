import type { ComponentType } from 'react'
import { ReactLogo, TsLogo, JsLogo, PyLogo, RustLogo, PhpLogo, CLogo, CppLogo, CsLogo } from './Logos'
import { REACT_STEPS, type ReactStep } from './steps'
import { TS_STEPS } from './ts'
import { JS_STEPS } from './js'
import { PY_STEPS } from './python'
import { RUST_STEPS } from './rust'
import { PHP_STEPS } from './php'
import { C_STEPS } from './c'
import { CPP_STEPS } from './cpp'
import { CS_STEPS } from './csharp'
import type { CodeStep } from './codeTrack'

export type Track = 'react' | 'ts' | 'js' | 'python' | 'rust' | 'php' | 'c' | 'cpp' | 'csharp'

export interface TrackDef {
  id: Track
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: ComponentType<any>
  steps: ReactStep[] | CodeStep[]
}

// Every track in header order. React renders live components; the others are code tracks
// (source + live or recorded output). Adding a language = one registry file + one row here.
export const TRACKS: TrackDef[] = [
  { id: 'react', label: 'React', Icon: ReactLogo, steps: REACT_STEPS },
  { id: 'ts', label: 'TypeScript', Icon: TsLogo, steps: TS_STEPS },
  { id: 'js', label: 'JavaScript', Icon: JsLogo, steps: JS_STEPS },
  { id: 'python', label: 'Python', Icon: PyLogo, steps: PY_STEPS },
  { id: 'rust', label: 'Rust', Icon: RustLogo, steps: RUST_STEPS },
  { id: 'php', label: 'PHP', Icon: PhpLogo, steps: PHP_STEPS },
  { id: 'c', label: 'C', Icon: CLogo, steps: C_STEPS },
  { id: 'cpp', label: 'C++', Icon: CppLogo, steps: CPP_STEPS },
  { id: 'csharp', label: 'C#', Icon: CsLogo, steps: CS_STEPS },
]

export const TRACK_IDS = TRACKS.map((t) => t.id)
export const STEP_COUNTS = Object.fromEntries(TRACKS.map((t) => [t.id, t.steps.length])) as Record<
  Track,
  number
>
export const CODE_TRACKS = TRACKS.filter((t) => t.id !== 'react') as (TrackDef & { steps: CodeStep[] })[]
