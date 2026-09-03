import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../App'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  localStorage.clear()
})

describe('App shell', () => {
  it('renders the first React step through the lazy/Suspense pipeline', async () => {
    render(<App />)
    // ButtonClick is lazy - findByText awaits the chunk resolving
    expect(await screen.findByText(/clicked 0 times/i)).toBeInTheDocument()
  })

  it('navigates to the next step and mirrors it into the URL hash', async () => {
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/next lesson/i))
    // the step title also appears inside the rendered source code panel, so scope to the heading
    expect(await screen.findByRole('heading', { name: '2. Add to a list' })).toBeInTheDocument()
    expect(window.location.hash).toBe('#react/2')
  })

  it('deep-links straight to a step from the hash', async () => {
    window.history.replaceState(null, '', '/#react/3')
    render(<App />)
    expect(await screen.findByRole('heading', { name: /3\. CRUD/i })).toBeInTheDocument()
    expect(screen.getByText('3 / 10')).toBeInTheDocument()
  })

  it('follows a hand-edited hash (hashchange) to another track and step', async () => {
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    window.location.hash = '#ts/4'
    fireEvent(window, new HashChangeEvent('hashchange'))
    expect(await screen.findByText('ArraysTuplesEnums.ts')).toBeInTheDocument()
    expect(screen.getByText('4 / 10')).toBeInTheDocument()
  })

  it('remembers the last step per track when switching back', async () => {
    window.history.replaceState(null, '', '/#react/3')
    render(<App />)
    await screen.findByRole('heading', { name: /3\. CRUD/i })
    fireEvent.click(screen.getByLabelText(/choose track/i))
    fireEvent.click(screen.getByText('TypeScript'))
    await screen.findByText('console output')
    fireEvent.click(screen.getByLabelText(/choose track/i))
    fireEvent.click(screen.getByText('React'))
    expect(await screen.findByRole('heading', { name: /3\. CRUD/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#react/3')
  })

  it('restores the persisted last step of a track', async () => {
    localStorage.setItem('sharpen-last-step', JSON.stringify({ react: 1, ts: 4 }))
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/choose track/i))
    fireEvent.click(screen.getByText('TypeScript'))
    expect(await screen.findByText('ArraysTuplesEnums.ts')).toBeInTheDocument()
  })

  it('ignores an out-of-range persisted step', async () => {
    localStorage.setItem('sharpen-last-step', JSON.stringify({ react: 1, ts: 99 }))
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/choose track/i))
    fireEvent.click(screen.getByText('TypeScript'))
    expect(await screen.findByText('HelloWorld.ts')).toBeInTheDocument()
  })

  it('switches to the TypeScript track and loads its code + runner', async () => {
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/choose track/i))
    fireEvent.click(screen.getByText('TypeScript'))
    expect(await screen.findByText('console output')).toBeInTheDocument()
    expect(await screen.findByText('HelloWorld.ts')).toBeInTheDocument()
    expect(window.location.hash).toBe('#ts/1')
  })

  it('toggles dark mode from the header and persists it', async () => {
    const { container } = render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/switch to dark mode/i))
    expect(container.querySelector('.app.dark')).not.toBeNull()
    expect(screen.getByLabelText(/switch to light mode/i)).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('sharpen-theme')).toBe('"dark"')
  })

  it('code font +/- controls change the editor size', async () => {
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    const before = (await screen.findAllByText(/^\d+px$/))[0].textContent
    fireEvent.click(screen.getAllByLabelText(/larger code font/i)[0])
    const after = screen.getAllByText(/^\d+px$/)[0].textContent
    expect(parseInt(after!)).toBe(parseInt(before!) + 1)
  })
})
