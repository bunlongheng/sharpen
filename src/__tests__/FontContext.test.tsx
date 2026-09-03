import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { FontProvider, useFont } from '../FontContext'

function Probe() {
  const { size, inc, dec, atMin, atMax } = useFont()
  return (
    <>
      <span data-testid="size">{size}</span>
      <button onClick={inc} disabled={atMax}>
        bigger
      </button>
      <button onClick={dec} disabled={atMin}>
        smaller
      </button>
    </>
  )
}

beforeEach(() => localStorage.clear())

describe('FontProvider', () => {
  it('clamps at 24px and disables the button at the top', () => {
    render(
      <FontProvider>
        <Probe />
      </FontProvider>,
    )
    const bigger = screen.getByText('bigger')
    for (let i = 0; i < 30; i++) fireEvent.click(bigger)
    expect(screen.getByTestId('size').textContent).toBe('24')
    expect(bigger).toBeDisabled()
  })

  it('clamps at 8px at the bottom and persists the offset under the sharpen- key', () => {
    render(
      <FontProvider>
        <Probe />
      </FontProvider>,
    )
    const smaller = screen.getByText('smaller')
    for (let i = 0; i < 30; i++) fireEvent.click(smaller)
    expect(screen.getByTestId('size').textContent).toBe('8')
    expect(smaller).toBeDisabled()
    expect(Number(localStorage.getItem('sharpen-code-font-delta'))).toBeLessThan(0)
  })
})
