import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Crud from '../Crud'

describe('Crud', () => {
  it('adds an item', () => {
    render(<Crud />)
    fireEvent.change(screen.getByPlaceholderText(/new item/i), { target: { value: 'Ship it' } })
    fireEvent.click(screen.getByText('Add'))
    expect(screen.getByText('Ship it')).toBeInTheDocument()
  })

  it('edits an item in place', () => {
    render(<Crud />)
    fireEvent.click(screen.getAllByText('Edit')[0])
    const input = screen.getByDisplayValue('Learn useState')
    fireEvent.change(input, { target: { value: 'Learn useReducer' } })
    fireEvent.click(screen.getByText('Save'))
    expect(screen.getByText('Learn useReducer')).toBeInTheDocument()
    expect(screen.queryByText('Learn useState')).toBeNull()
  })

  it('deletes an item', () => {
    render(<Crud />)
    fireEvent.click(screen.getAllByText('Delete')[0])
    expect(screen.queryByText('Learn useState')).toBeNull()
  })
})
