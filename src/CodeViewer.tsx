import { useMemo, useState } from 'react'
import { Highlight, type PrismTheme } from 'prism-react-renderer'
import { Copy, Check } from 'lucide-react'
import { useFont } from './FontContext'

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

export default function CodeViewer({ file, source }: { file: string; source: string }) {
  const [copied, setCopied] = useState(false)
  const { size: fontSize } = useFont()
  const code = useMemo(() => stripNotesBlock(source), [source])
  const name = file.split('/').pop() ?? file

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="code-viewer">
      <div className="code-head">
        <span className="code-file">{name}</span>
        <button className="icon-btn" onClick={copy} title={copied ? 'Copied' : 'Copy code'} aria-label="Copy code">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
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
