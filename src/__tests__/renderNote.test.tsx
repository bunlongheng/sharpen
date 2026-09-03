import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderNote } from '../App'

describe('renderNote', () => {
  it('turns backtick spans into inline code chips', () => {
    const { container } = render(<p>{renderNote('use `setCount(c => c + 1)` here')}</p>)
    const code = container.querySelector('code.note-code')
    expect(code).not.toBeNull()
    expect(code!.textContent).toBe('setCount(c => c + 1)')
    expect(container.textContent).toContain('use ')
    expect(container.textContent).toContain(' here')
  })

  it('leaves plain text untouched', () => {
    const { container } = render(<p>{renderNote('no code here')}</p>)
    expect(container.querySelector('code')).toBeNull()
    expect(container.textContent).toBe('no code here')
  })
})
