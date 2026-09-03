import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Router from '../Router'

describe('Router step (protected route)', () => {
  it('redirects to /login when logged out, then shows the dashboard after login', () => {
    render(<Router />)
    fireEvent.click(screen.getByText('Dashboard (protected)'))
    expect(screen.getByText(/log in/i, { selector: 'p' })).toBeInTheDocument()
    expect(screen.queryByText(/secret dashboard/i)).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))
    fireEvent.click(screen.getByText('Dashboard (protected)'))
    expect(screen.getByText(/secret dashboard/i)).toBeInTheDocument()
  })
})
