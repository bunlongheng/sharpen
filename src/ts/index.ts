import {
  Hand,
  Puzzle,
  Shuffle,
  Brackets,
  Boxes,
  FunctionSquare,
  Wrench,
  Building2,
  Brain,
  Hourglass,
  type LucideIcon,
} from 'lucide-react'

import type { CodeStep, RunFn } from '../codeTrack'

export type { Logger, RunFn } from '../codeTrack'
export type TsStep = CodeStep

// Each lesson module (its run() function) and its source text load on demand as their own chunk.
const mods = import.meta.glob(['./*.ts', '!./index.ts']) as Record<string, () => Promise<{ run: RunFn }>>
const raw = import.meta.glob(['./*.ts', '!./index.ts'], { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>

const step = (id: number, label: string, Icon: LucideIcon, blurb: string, file: string): TsStep => ({
  id,
  label,
  Icon,
  blurb,
  file,
  lang: 'tsx',
  load: async () => {
    const [mod, source] = await Promise.all([mods[`./${file}`](), raw[`./${file}`]()])
    return { source, run: mod.run }
  },
})

export const TS_STEPS: TsStep[] = [
  step(1, 'Hello World', Hand, 'types, inference, functions', 'HelloWorld.ts'),
  step(2, 'Interfaces & Types', Puzzle, 'object shapes, optional, readonly', 'InterfacesTypes.ts'),
  step(3, 'Unions & Narrowing', Shuffle, 'discriminated unions, type guards', 'UnionsNarrowing.ts'),
  step(4, 'Arrays, Tuples, Enums', Brackets, 'collections and constants', 'ArraysTuplesEnums.ts'),
  step(5, 'Generics', Boxes, 'reusable, type-safe code', 'Generics.ts'),
  step(6, 'Functions', FunctionSquare, 'overloads, rest params, callbacks', 'Functions.ts'),
  step(7, 'Utility Types', Wrench, 'Partial, Pick, Omit, Record', 'UtilityTypes.ts'),
  step(8, 'Classes', Building2, 'modifiers, abstract, implements', 'Classes.ts'),
  step(9, 'Advanced Types', Brain, 'keyof, mapped, conditional, infer', 'AdvancedTypes.ts'),
  step(10, 'Async', Hourglass, 'promises, async/await, error handling', 'AsyncAwait.ts'),
]
