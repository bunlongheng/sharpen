import { useEffect, useMemo, useState } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'

// Monokai theme for prism-react-renderer.
const monokai: PrismTheme = {
  plain: { color: '#f8f8f2', backgroundColor: '#272822' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#75715e', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#f8f8f2' } },
    { types: ['property', 'tag', 'constant', 'symbol', 'deleted'], style: { color: '#f92672' } },
    { types: ['boolean', 'number'], style: { color: '#ae81ff' } },
    { types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'], style: { color: '#a6e22e' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#f8f8f2' } },
    { types: ['atrule', 'attr-value', 'function', 'class-name'], style: { color: '#e6db74' } },
    { types: ['keyword'], style: { color: '#66d9ef', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#fd971f' } },
  ],
}

// Show the working code WITH its comments, but drop the <details> interview-notes JSX block
// (it already renders in the Result panel - no need to repeat it in the code).
function stripNotesBlock(src: string): string {
  const out: string[] = []
  let inDetails = false
  for (const line of src.split('\n')) {
    const t = line.trim()
    if (inDetails) {
      if (t.includes('</details>')) inDetails = false
      continue
    }
    if (t.includes('<details className="notes"')) {
      if (!t.includes('</details>')) inDetails = true
      continue
    }
    out.push(line)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const MIN_FONT = 6
const MAX_FONT = 24

// Base code font by screen width: phone 8, iPad portrait 9, landscape 10, desktop 11.
function baseFontFor(width: number): number {
  if (width <= 480) return 8
  if (width <= 834) return 9
  if (width <= 1366) return 10
  return 11
}

export default function CodeViewer({ file, source }: { file: string; source: string }) {
  const [copied, setCopied] = useState(false)
  // A-/A+ store an OFFSET so the base can still scale with the window.
  const [delta, setDelta] = useState<number>(() => Number(localStorage.getItem('rip-code-font-delta')) || 0)
  const [base, setBase] = useState<number>(() => baseFontFor(window.innerWidth))
  useEffect(() => {
    const onResize = () => setBase(baseFontFor(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fontSize = Math.min(MAX_FONT, Math.max(MIN_FONT, base + delta))
  const code = useMemo(() => stripNotesBlock(source), [source])
  const name = file.split('/').pop() ?? file

  function bump(d: number) {
    setDelta((x) => {
      const next = x + d
      localStorage.setItem('rip-code-font-delta', String(next))
      return next
    })
  }

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="code-viewer">
      <div className="code-head">
        <span className="code-file">{name}</span>
        <span className="code-actions">
          <button className="seg" onClick={() => bump(-1)} disabled={fontSize <= MIN_FONT} title="Smaller">A-</button>
          <span className="code-fontsize">{fontSize}px</span>
          <button className="seg" onClick={() => bump(1)} disabled={fontSize >= MAX_FONT} title="Larger">A+</button>
          <button className="seg" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        </span>
      </div>
      <div className="code-body">
        <Highlight code={code} language="tsx" theme={monokai}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre className="code-pre" style={{ ...style, fontSize, lineHeight: 1.5 }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="code-line">
                  <span className="ln">{i + 1}</span>
                  <span className="lc">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
