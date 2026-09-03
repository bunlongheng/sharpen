import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CodeViewer from '../CodeViewer'
import { FontProvider } from '../FontContext'
import { ThemeProvider } from '../context/ThemeContext'

describe('CodeViewer', () => {
  it('renders the file name and the code', () => {
    render(
      <ThemeProvider>
        <FontProvider>
          <CodeViewer file="Example.tsx" source={'const hello = 1'} variant="ts" />
        </FontProvider>
      </ThemeProvider>,
    )
    expect(screen.getByText('Example.tsx')).toBeInTheDocument()
    expect(screen.getByLabelText(/copy code/i)).toBeInTheDocument()
  })
})

describe('CodeViewer copy button', () => {
  it('writes the shown source to the clipboard and flips the title to Copied', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(
      <ThemeProvider>
        <FontProvider>
          <CodeViewer file="x.ts" source="const hello = 1" />
        </FontProvider>
      </ThemeProvider>,
    )
    const btn = screen.getByRole('button', { name: /copy code/i })
    fireEvent.click(btn)
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('const hello = 1'))
    await waitFor(() => expect(btn).toHaveAttribute('title', 'Copied'))
  })
})
