import { useEffect, useState } from 'react'
import { useFont } from './FontContext'

function fmt(a: unknown): string {
  if (typeof a === 'string') return a
  if (typeof a === 'object' && a !== null) {
    try { return JSON.stringify(a) } catch { return String(a) }
  }
  return String(a)
}

// Runs a TypeScript step's run() and captures its console.log output for display.
export default function TsRunner({ run }: { run: () => void | Promise<void> }) {
  const [lines, setLines] = useState<string[]>([])
  const { size: fontSize } = useFont()

  useEffect(() => {
    let cancelled = false
    const logs: string[] = []
    const orig = console.log
    console.log = (...args: unknown[]) => logs.push(args.map(fmt).join(' '))
    Promise.resolve()
      .then(() => run())
      .catch((e) => logs.push('Error: ' + String(e)))
      .finally(() => {
        console.log = orig
        if (!cancelled) setLines([...logs])
      })
    return () => {
      cancelled = true
      console.log = orig
    }
  }, [run])

  return (
    <div className="ts-output-wrap">
      <div className="ts-output-head">console output</div>
      <pre className="ts-output" style={{ fontSize, lineHeight: 1.5 }}>{lines.length ? lines.join('\n') : 'Running...'}</pre>
    </div>
  )
}
