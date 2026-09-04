import { renderHook, waitFor, render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useLoaded } from '../hooks/useLoaded'
import ErrorBoundary from '../ErrorBoundary'

function deferred<T>() {
  let resolve!: (v: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}

describe('useLoaded', () => {
  it('returns null while pending, then the value', async () => {
    const d = deferred<string>()
    const load = () => d.promise
    const { result } = renderHook(() => useLoaded(load))
    expect(result.current).toBeNull()
    d.resolve('ready')
    await waitFor(() => expect(result.current).toBe('ready'))
  })

  it('ignores a stale loader that resolves after the current one', async () => {
    const a = deferred<string>()
    const loadA = () => a.promise
    const loadB = () => Promise.resolve('B')
    const { result, rerender } = renderHook(({ load }) => useLoaded(load), { initialProps: { load: loadA } })
    rerender({ load: loadB })
    await waitFor(() => expect(result.current).toBe('B'))
    a.resolve('A')
    await new Promise((r) => setTimeout(r, 0))
    expect(result.current).toBe('B')
  })

  it('returns null for a new loader even while the previous value is still in state', async () => {
    const loadA = () => Promise.resolve('A')
    const b = deferred<string>()
    const loadB = () => b.promise
    const { result, rerender } = renderHook(({ load }) => useLoaded(load), { initialProps: { load: loadA } })
    await waitFor(() => expect(result.current).toBe('A'))
    rerender({ load: loadB })
    expect(result.current).toBeNull() // render-time identity guard, not the effect flag
    b.resolve('B')
    await waitFor(() => expect(result.current).toBe('B'))
  })

  it('serves a cached loader synchronously on revisit', async () => {
    const load = vi.fn(() => Promise.resolve('once'))
    const first = renderHook(() => useLoaded(load))
    await waitFor(() => expect(first.result.current).toBe('once'))
    const second = renderHook(() => useLoaded(load))
    expect(second.result.current).toBe('once')
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('throws a failed load into the nearest ErrorBoundary instead of hanging', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const load = () => Promise.reject(new Error('chunk 404'))
    function View() {
      const v = useLoaded(load)
      return <p>{v ?? 'Loading...'}</p>
    }
    render(
      <ErrorBoundary>
        <View />
      </ErrorBoundary>,
    )
    expect(await screen.findByText(/this step crashed: chunk 404/i)).toBeInTheDocument()
    spy.mockRestore()
  })
})
