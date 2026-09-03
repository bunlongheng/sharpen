import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App shell', () => {
  it('renders the first React step through the lazy/Suspense pipeline', async () => {
    render(<App />)
    // ButtonClick is lazy - findByText awaits the chunk resolving
    expect(await screen.findByText(/clicked 0 times/i)).toBeInTheDocument()
  })

  it('navigates to the next step', async () => {
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/next lesson/i))
    // the step title also appears inside the rendered source code panel, so scope to the heading
    expect(await screen.findByRole('heading', { name: '2. Add to a list' })).toBeInTheDocument()
  })

  it('switches to the TypeScript track', async () => {
    render(<App />)
    await screen.findByText(/clicked 0 times/i)
    fireEvent.click(screen.getByLabelText(/choose track/i))
    fireEvent.click(screen.getByText('TypeScript'))
    expect(await screen.findByText('console output')).toBeInTheDocument()
  })
})
