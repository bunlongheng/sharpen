import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import FetchApi from '../FetchApi'

const WEATHER = {
  current: { temperature_2m: 68.5, weather_code: 3, wind_speed_10m: 12.3 },
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('FetchApi', () => {
  it('shows the loading state first', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
    render(<FetchApi />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders weather rows on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(WEATHER) })),
    )
    render(<FetchApi />)
    expect(await screen.findByText(/partly cloudy/i)).toBeInTheDocument()
    expect(screen.getByText(/68\.5 F/)).toBeInTheDocument()
    expect(screen.getByText(/12\.3 km\/h/)).toBeInTheDocument()
  })

  it('renders the error state on a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 500 })),
    )
    render(<FetchApi />)
    expect(await screen.findByText(/failed to load: http 500/i)).toBeInTheDocument()
  })
})
