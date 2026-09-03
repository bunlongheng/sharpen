import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ButtonClick from '../ButtonClick'

describe('ButtonClick', () => {
  it('starts at 0', () => {
    render(<ButtonClick />)
    expect(screen.getByText(/clicked 0 times/i)).toBeInTheDocument()
  })

  it('increments the count when clicked', () => {
    render(<ButtonClick />)
    fireEvent.click(screen.getByText(/clicked 0 times/i))
    expect(screen.getByText(/clicked 1 times/i)).toBeInTheDocument()
  })

  it('resets back to 0', () => {
    render(<ButtonClick />)
    fireEvent.click(screen.getByText(/clicked 0 times/i))
    fireEvent.click(screen.getByText(/reset/i))
    expect(screen.getByText(/clicked 0 times/i)).toBeInTheDocument()
  })
})
