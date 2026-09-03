import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from '../Dropdown'
import { ReactLogo, TsLogo, JsLogo } from '../Logos'

const OPTIONS = [
  { value: 'a', label: 'Alpha', Icon: ReactLogo },
  { value: 'b', label: 'Beta', Icon: TsLogo },
  { value: 'c', label: 'Gamma', Icon: JsLogo },
]

function setup(onChange = vi.fn()) {
  render(<Dropdown options={OPTIONS} value="a" onChange={onChange} ariaLabel="Pick one" />)
  return onChange
}

describe('Dropdown keyboard navigation', () => {
  it('opens with ArrowDown and selects the next option with Enter', () => {
    const onChange = setup()
    const btn = screen.getByRole('button', { name: /pick one/i })
    fireEvent.keyDown(btn, { key: 'ArrowDown' }) // opens, highlights current (a)
    fireEvent.keyDown(btn, { key: 'ArrowDown' }) // moves to b
    fireEvent.keyDown(btn, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('End jumps to the last option', () => {
    const onChange = setup()
    const btn = screen.getByRole('button', { name: /pick one/i })
    fireEvent.keyDown(btn, { key: 'Enter' }) // open
    fireEvent.keyDown(btn, { key: 'End' })
    fireEvent.keyDown(btn, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('Escape closes the menu without selecting', () => {
    const onChange = setup()
    const btn = screen.getByRole('button', { name: /pick one/i })
    fireEvent.keyDown(btn, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('mouse click still selects', () => {
    const onChange = setup()
    fireEvent.click(screen.getByRole('button', { name: /pick one/i }))
    fireEvent.click(screen.getByText('Gamma'))
    expect(onChange).toHaveBeenCalledWith('c')
  })
})
