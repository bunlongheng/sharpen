import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Step1ButtonClick from '../Step1ButtonClick'

describe('Step1ButtonClick', () => {
  it('starts at 0', () => {
    render(<Step1ButtonClick />)
    expect(screen.getByText(/clicked 0 times/i)).toBeInTheDocument()
  })

  it('increments the count when clicked', () => {
    render(<Step1ButtonClick />)
    fireEvent.click(screen.getByText(/clicked 0 times/i))
    expect(screen.getByText(/clicked 1 times/i)).toBeInTheDocument()
  })

  it('resets back to 0', () => {
    render(<Step1ButtonClick />)
    fireEvent.click(screen.getByText(/clicked 0 times/i))
    fireEvent.click(screen.getByText(/reset/i))
    expect(screen.getByText(/clicked 0 times/i)).toBeInTheDocument()
  })
})
