import { useEffect, useState } from 'react'
import { useFont } from './FontContext'
import type { Logger, RunFn } from './ts'

export type { Logger }

function fmt(a: unknown): string {
  if (typeof a === 'string') return a
  if (typeof a === 'object' && a !== null) {
    try {
      return JSON.stringify(a)
    } catch {
      return String(a)
    }
  }
  return String(a)
}

// Runs a TypeScript step's run(log) and shows every line it logs.
export default function TsRunner({ run }: { run: RunFn }) {
  const [lines, setLines] = useState<string[] | null>(null)
  const { size: fontSize } = useFont()

  useEffect(() => {
    let cancelled = false
    const logs: string[] = []
    // Scoped logger: only this run's output lands here, and late async logs still show up.
    const log: Logger = (...args) => {
      logs.push(args.map(fmt).join(' '))
      if (!cancelled) setLines([...logs])
    }
    Promise.resolve()
      .then(() => {
        if (!cancelled) setLines(null)
      })
      .then(() => run(log))
      .catch((e) => log('Error: ' + String(e)))
      .finally(() => {
        if (!cancelled) setLines([...logs])
      })
    return () => {
      cancelled = true
    }
  }, [run])

  return (
    <div className="ts-output-wrap">
      <div className="ts-output-head">console output</div>
      <pre className="ts-output" style={{ fontSize, lineHeight: 1.5 }}>
        {lines === null ? 'Running...' : lines.length ? lines.join('\n') : '(no output)'}
      </pre>
    </div>
  )
}
