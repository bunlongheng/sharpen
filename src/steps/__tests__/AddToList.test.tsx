import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AddToList from '../AddToList'

describe('AddToList', () => {
  it('shows an empty message with no items', () => {
    render(<AddToList />)
    expect(screen.getByText(/no items yet/i)).toBeInTheDocument()
  })

  it('adds a typed item to the list', () => {
    render(<AddToList />)
    const input = screen.getByPlaceholderText(/type something/i)
    fireEvent.change(input, { target: { value: 'Learn testing' } })
    fireEvent.click(screen.getByText('Add'))
    expect(screen.getByText('Learn testing')).toBeInTheDocument()
  })
})
