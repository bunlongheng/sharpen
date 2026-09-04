import type { LucideIcon } from 'lucide-react'

export type Logger = (...args: unknown[]) => void
export type RunFn = (log: Logger) => void | Promise<void>
export type CodeLang = 'tsx' | 'javascript' | 'python' | 'rust' | 'php' | 'c' | 'cpp' | 'csharp'

// A "code track" lesson: source text in one panel, output in the other. The output is either
// produced live (run) when the language executes in the browser (TypeScript, JavaScript), or
// recorded (output) from a real run when it cannot - the panel says which.
export interface CodeStep {
  id: number
  label: string
  Icon: LucideIcon
  blurb: string
  file: string
  lang: CodeLang
  load: () => Promise<{ source: string; run?: RunFn; output?: string }>
}

export type Row = [id: number, label: string, Icon: LucideIcon, blurb: string, file: string]
type Raw = Record<string, () => Promise<string>>

// Lessons that run in the browser: a module exporting run(log) plus its source text.
export function liveSteps(
  lang: CodeLang,
  mods: Record<string, () => Promise<{ run: RunFn }>>,
  raw: Raw,
  rows: Row[],
): CodeStep[] {
  return rows.map(([id, label, Icon, blurb, file]) => ({
    id,
    label,
    Icon,
    blurb,
    file,
    lang,
    load: async () => {
      const [mod, source] = await Promise.all([mods[`./${file}`](), raw[`./${file}`]()])
      return { source, run: mod.run }
    },
  }))
}

// Lessons that cannot run in the browser: source text plus stdout recorded by scripts/record-lessons.mjs.
export function recordedSteps(lang: CodeLang, raw: Raw, outs: Raw, ext: string, rows: Row[]): CodeStep[] {
  return rows.map(([id, label, Icon, blurb, file]) => ({
    id,
    label,
    Icon,
    blurb,
    file,
    lang,
    load: async () => {
      const [source, output] = await Promise.all([
        raw[`./${file}`](),
        outs[`./${file.slice(0, -ext.length)}.out.txt`](),
      ])
      return { source, output }
    },
  }))
}
