import { useMemo, useState } from 'react'

// Strips the teaching comments so you see just the "core" working code.
// Removes whole-line // comments (including the "Interview notes" block) and collapses blank runs.
function coreOnly(src: string): string {
  const out: string[] = []
  let inNotes = false
  for (const line of src.split('\n')) {
    const t = line.trim()
    if (t.startsWith('// Interview notes')) { inNotes = true; continue }
    if (inNotes) { if (t.startsWith('//') || t === '') continue; inNotes = false }
    if (t.startsWith('//')) continue          // whole-line comment
    if (t.startsWith('/*') || t.startsWith('*') || t.endsWith('*/')) continue
    out.push(line)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export default function CodeViewer({ file, source }: { file: string; source: string }) {
  const [mode, setMode] = useState<'core' | 'full'>('core')
  const [copied, setCopied] = useState(false)
  const code = useMemo(() => (mode === 'core' ? coreOnly(source) : source.trim()), [mode, source])
  const lines = code.split('\n')

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="code-viewer">
      <div className="code-head">
        <span className="code-file">{file}</span>
        <span className="code-actions">
          <button className={mode === 'core' ? 'seg on' : 'seg'} onClick={() => setMode('core')}>Core</button>
          <button className={mode === 'full' ? 'seg on' : 'seg'} onClick={() => setMode('full')}>Full</button>
          <button className="seg" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        </span>
      </div>
      <div className="code-body">
        <pre className="code-pre">
          <code>
            {lines.map((l, i) => (
              <div className="code-line" key={i}>
                <span className="ln">{i + 1}</span>
                <span className="lc">{l || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
