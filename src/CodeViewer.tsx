import { useState } from 'react'
import { Highlight, Prism, type PrismTheme } from 'prism-react-renderer'
import { Copy, Check, Minus, Plus } from 'lucide-react'
import { useFont } from './FontContext'
import { useTheme } from './context/ThemeContext'
import { TsLogo, JsLogo, PyLogo, RustLogo, PhpLogo, CLogo, CppLogo, CsLogo } from './Logos'
import type { CodeLang } from './codeTrack'

// prism-react-renderer bundles tsx/javascript/python/rust/cpp; PHP, C and C# grammars come from
// prismjs and register against the shared Prism instance (App awaits prismReady before rendering).
;(globalThis as { Prism?: unknown }).Prism = Prism
export const prismReady: Promise<unknown> = Promise.all([
  import('prismjs/components/prism-c'),
  import('prismjs/components/prism-markup-templating').then(() => import('prismjs/components/prism-php')),
  import('prismjs/components/prism-csharp'),
])

const LOGOS: Record<CodeLang, typeof TsLogo> = {
  tsx: TsLogo,
  javascript: JsLogo,
  python: PyLogo,
  rust: RustLogo,
  php: PhpLogo,
  c: CLogo,
  cpp: CppLogo,
  csharp: CsLogo,
}

// TypeScript: a light blue theme.
const blueTheme: PrismTheme = {
  plain: { color: '#24344d', backgroundColor: '#f5f9ff' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#60728a', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#57606a' } },
    { types: ['property', 'tag', 'symbol', 'deleted'], style: { color: '#0e7490' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#b45309' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: '#0a799d' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#24344d' } },
    { types: ['atrule', 'function', 'class-name', 'builtin'], style: { color: '#8250df' } },
    { types: ['attr-name', 'selector'], style: { color: '#116329' } },
    { types: ['keyword'], style: { color: '#0550ae', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#cf222e' } },
  ],
}

// JavaScript: a light sand / yellow theme.
const sandTheme: PrismTheme = {
  plain: { color: '#5b4636', backgroundColor: '#fbf3d5' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#796b35', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#7a6a3a' } },
    { types: ['property', 'tag', 'symbol', 'deleted'], style: { color: '#a3560f' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#9a3412' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: '#627318' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#5b4636' } },
    { types: ['atrule', 'function', 'class-name', 'builtin'], style: { color: '#8f650a' } },
    { types: ['attr-name', 'selector'], style: { color: '#627318' } },
    { types: ['keyword'], style: { color: '#b05109', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#9a3412' } },
  ],
}

// Dark-mode counterparts: same hue families on a slate ground so the panels match the dark shell.
const blueDark: PrismTheme = {
  plain: { color: '#d6e2f2', backgroundColor: '#0f1b2d' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#7f95b3', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#9fb3cc' } },
    { types: ['property', 'tag', 'symbol', 'deleted'], style: { color: '#67e8f9' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#fbbf24' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: '#7dd3fc' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#d6e2f2' } },
    { types: ['atrule', 'function', 'class-name', 'builtin'], style: { color: '#c4b5fd' } },
    { types: ['attr-name', 'selector'], style: { color: '#86efac' } },
    { types: ['keyword'], style: { color: '#93c5fd', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#fca5a5' } },
  ],
}

const sandDark: PrismTheme = {
  plain: { color: '#efe4c8', backgroundColor: '#2a2415' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#a89468', fontStyle: 'italic' } },
    { types: ['punctuation'], style: { color: '#c9b98a' } },
    { types: ['property', 'tag', 'symbol', 'deleted'], style: { color: '#fdba74' } },
    { types: ['boolean', 'number', 'constant'], style: { color: '#fca5a5' } },
    { types: ['string', 'char', 'attr-value', 'inserted'], style: { color: '#bef264' } },
    { types: ['operator', 'entity', 'url', 'variable'], style: { color: '#efe4c8' } },
    { types: ['atrule', 'function', 'class-name', 'builtin'], style: { color: '#fde68a' } },
    { types: ['attr-name', 'selector'], style: { color: '#bef264' } },
    { types: ['keyword'], style: { color: '#fbbf24', fontStyle: 'italic' } },
    { types: ['regex', 'important'], style: { color: '#fca5a5' } },
  ],
}

export default function CodeViewer({
  file,
  source,
  variant = 'ts',
  language = 'tsx',
}: {
  file: string
  source: string
  variant?: 'ts' | 'js' | 'py'
  language?: CodeLang
}) {
  const [copied, setCopied] = useState(false)
  const { size: fontSize, inc, dec, atMin, atMax } = useFont()
  const dark = useTheme().theme === 'dark'
  const name = file.split('/').pop() ?? file
  const Logo = variant === 'js' ? JsLogo : LOGOS[language]
  const theme = variant === 'js' ? (dark ? sandDark : sandTheme) : dark ? blueDark : blueTheme

  async function copy() {
    try {
      await navigator.clipboard.writeText(source)
    } catch {
      // clipboard API needs a secure context - fall back to a hidden textarea
      const ta = document.createElement('textarea')
      ta.value = source
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={`code-viewer variant-${variant}`}>
      <div className="code-head">
        <span className="code-lang">
          <Logo size={15} />
        </span>
        <span className="code-file">{name}</span>
        <div className="code-actions">
          <button
            className="icon-btn"
            onClick={dec}
            disabled={atMin}
            title="Smaller code font"
            aria-label="Smaller code font"
          >
            <Minus size={14} />
          </button>
          <span className="code-fontsize" aria-live="polite">
            {fontSize}px
          </span>
          <button
            className="icon-btn"
            onClick={inc}
            disabled={atMax}
            title="Larger code font"
            aria-label="Larger code font"
          >
            <Plus size={14} />
          </button>
          <button
            className="icon-btn"
            onClick={copy}
            title={copied ? 'Copied' : 'Copy code'}
            aria-label="Copy code"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Copied' : ''}
          </span>
        </div>
      </div>
      <div className="code-body">
        <Highlight code={source} language={language} theme={theme}>
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
