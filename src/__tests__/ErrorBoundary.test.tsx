import { render, screen } from '@testing-library/react'
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

  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('all good')).toBeInTheDocument()
  })
})
