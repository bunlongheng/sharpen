import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TsRunner from '../TsRunner'
import { FontProvider } from '../FontContext'

describe('TsRunner', () => {
  it('captures console.log output from run() and renders it', async () => {
    const run = () => {
      console.log('hello', 42)
      console.log({ a: 1 })
    }
    render(
      <FontProvider>
        <TsRunner run={run} />
      </FontProvider>,
    )
    expect(await screen.findByText(/hello 42/)).toBeInTheDocument()
    expect(screen.getByText(/{"a":1}/)).toBeInTheDocument()
  })

  it('renders the error line when run() rejects', async () => {
    const run = () => Promise.reject(new Error('boom'))
    render(
      <FontProvider>
        <TsRunner run={run} />
      </FontProvider>,
    )
    expect(await screen.findByText(/Error: Error: boom/)).toBeInTheDocument()
  })
})
