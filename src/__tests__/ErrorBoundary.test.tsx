import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from '../ErrorBoundary'

function Bomb(): never {
  throw new Error('kaboom')
}

describe('ErrorBoundary', () => {
  it('renders the fallback instead of white-screening when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/this step crashed: kaboom/i)).toBeInTheDocument()
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
    spy.mockRestore()
  })

  it('Try again re-renders the children after a one-off crash', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    let broken = true
    function Flaky() {
      if (broken) throw new Error('once')
      return <p>recovered</p>
    }
    render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/this step crashed: once/i)).toBeInTheDocument()
    broken = false
    fireEvent.click(screen.getByText(/try again/i))
    expect(screen.getByText('recovered')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('offers Reload instead of Try again when a lazy chunk failed to load', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function Stale(): never {
      throw new Error('Failed to fetch dynamically imported module: /assets/Charts-abc.js')
    }
    render(
      <ErrorBoundary>
        <Stale />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/could not be downloaded/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument()
    expect(screen.queryByText(/try again/i)).toBeNull()
    spy.mockRestore()
  })

  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('all good')).toBeInTheDocument()
  })
})
