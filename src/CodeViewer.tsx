import { useMemo, useState } from 'react'
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

// "Core" = just the working code. Strips teaching comments AND the <details> interview-notes block.
function coreOnly(src: string): string {
  const out: string[] = []
  let inNotesComment = false // // Interview notes: ... comment block
  let inDetails = false // <details className="notes"> ... </details> JSX block
  for (const line of src.split('\n')) {
    const t = line.trim()
    if (inDetails) {
      if (t.includes('</details>')) inDetails = false
      continue
    }
    if (t.includes('<details className="notes"')) {
      // handle a one-line details too
      if (!t.includes('</details>')) inDetails = true
      continue
    }
    if (t.startsWith('// Interview notes')) { inNotesComment = true; continue }
    if (inNotesComment) { if (t.startsWith('//') || t === '') continue; inNotesComment = false }
    if (t.startsWith('//')) continue
    if (t.startsWith('/*') || t.startsWith('*') || t.endsWith('*/')) continue
    out.push(line)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const MIN_FONT = 8
const MAX_FONT = 24
const DEFAULT_FONT = 13

export default function CodeViewer({ file, source }: { file: string; source: string }) {
  const [mode, setMode] = useState<'core' | 'full'>('core')
  const [copied, setCopied] = useState(false)
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = Number(localStorage.getItem('rip-code-font'))
    return saved >= MIN_FONT && saved <= MAX_FONT ? saved : DEFAULT_FONT
  })
  const code = useMemo(() => (mode === 'core' ? coreOnly(source) : source.trim()), [mode, source])
  const name = file.split('/').pop() ?? file

  function bump(delta: number) {
    setFontSize((f) => {
      const next = Math.min(MAX_FONT, Math.max(MIN_FONT, f + delta))
      localStorage.setItem('rip-code-font', String(next))
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
          <button className={mode === 'core' ? 'seg on' : 'seg'} onClick={() => setMode('core')}>Core</button>
          <button className={mode === 'full' ? 'seg on' : 'seg'} onClick={() => setMode('full')}>Full</button>
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
