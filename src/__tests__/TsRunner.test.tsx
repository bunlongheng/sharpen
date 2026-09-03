import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TsRunner from '../TsRunner'
import type { Logger } from '../TsRunner'
import { FontProvider } from '../FontContext'

describe('TsRunner', () => {
  it('captures console.log output from run() and renders it', async () => {
    const run = (log: Logger) => {
      log('hello', 42)
      log({ a: 1 })
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

  it('does not touch the global console.log', async () => {
    const spy = vi.spyOn(console, 'log')
    const run = (log: Logger) => {
      log('x')
    }
    render(
      <FontProvider>
        <TsRunner run={run} />
      </FontProvider>,
    )
    await screen.findByText('x')
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('shows late async logs', async () => {
    const run = (log: Logger) => {
      setTimeout(() => log('late'), 10)
    }
    render(
      <FontProvider>
        <TsRunner run={run} />
      </FontProvider>,
    )
    expect(await screen.findByText('late')).toBeInTheDocument()
  })
})
