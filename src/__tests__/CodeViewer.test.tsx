import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CodeViewer, { stripNotesBlock } from '../CodeViewer'
import { FontProvider } from '../FontContext'

describe('stripNotesBlock', () => {
  it('drops the <details className="notes"> block but keeps the rest', () => {
    const src = [
      'const a = 1',
      '      <details className="notes">',
      '        <li>secret notes</li>',
      '      </details>',
      'const b = 2',
    ].join('\n')
    const out = stripNotesBlock(src)
    expect(out).toContain('const a = 1')
    expect(out).toContain('const b = 2')
    expect(out).not.toContain('secret notes')
  })

  it('returns code unchanged when there is no notes block', () => {
    const src = 'const x = 1\nconst y = 2'
    expect(stripNotesBlock(src)).toBe(src)
  })
})

describe('CodeViewer', () => {
  it('renders the file name and the code', () => {
    render(
      <FontProvider>
        <CodeViewer file="Example.tsx" source={'const hello = 1'} variant="ts" />
      </FontProvider>,
    )
    expect(screen.getByText('Example.tsx')).toBeInTheDocument()
    expect(screen.getByLabelText(/copy code/i)).toBeInTheDocument()
  })
})
