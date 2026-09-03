import { useMemo, useState } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { Copy, Check } from 'lucide-react'
import { useFont } from './FontContext'

// TypeScript: a bluer dark theme (Night-Owl-ish).
const blueTheme: PrismTheme = {
  plain: { color: '#d6e6ff', backgroundColor: '#0d1f33' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#5f7e97', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#b6cff2' } },
    { types: ['property', 'tag', 'symbol', 'deleted'], style: { color: '#7fdbca' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#f78c6c' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: '#a5d6ff' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#d6e6ff' } },
    { types: ['atrule', 'function', 'class-name', 'builtin'], style: { color: '#82aaff' } },
    { types: ['attr-name', 'selector'], style: { color: '#c5e478' } },
    { types: ['keyword'], style: { color: '#82aaff', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#ffcb6b' } },
  ],
}

// JavaScript: a light sand / yellow theme.
const sandTheme: PrismTheme = {
  plain: { color: '#5b4636', backgroundColor: '#fbf3d5' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#a1873f', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#7a6a3a' } },
    { types: ['property', 'tag', 'symbol', 'deleted'], style: { color: '#a3560f' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#9a3412' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: '#6b7d1a' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#5b4636' } },
    { types: ['atrule', 'function', 'class-name', 'builtin'], style: { color: '#92670a' } },
    { types: ['attr-name', 'selector'], style: { color: '#6b7d1a' } },
    { types: ['keyword'], style: { color: '#b45309', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#9a3412' } },
  ],
}

// Show the working code WITH its comments, but drop the <details> interview-notes JSX block.
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

export default function CodeViewer({
  file,
  source,
  variant = 'ts',
}: {
  file: string
  source: string
  variant?: 'ts' | 'js'
}) {
  const [copied, setCopied] = useState(false)
  const { size: fontSize } = useFont()
  const code = useMemo(() => stripNotesBlock(source), [source])
  const name = file.split('/').pop() ?? file
  const theme = variant === 'js' ? sandTheme : blueTheme

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={`code-viewer variant-${variant}`}>
      <div className="code-head">
        <span className="code-file">{name}</span>
        <button className="icon-btn" onClick={copy} title={copied ? 'Copied' : 'Copy code'} aria-label="Copy code">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <div className="code-body">
        <Highlight code={code} language="tsx" theme={theme}>
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
