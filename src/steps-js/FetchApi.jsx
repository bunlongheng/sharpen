import { useEffect, useState } from 'react'

// Open-Meteo weather codes -> a human label
function describe(code) {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rain showers'
  return 'Thunderstorm'
}

export default function FetchApi() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let ignore = false
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit',
          { signal: controller.signal },
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!ignore) setWeather(data.current)
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    // Cleanup: prevents setting state after unmount and cancels the in-flight request
    return () => {
      ignore = true
      controller.abort()
    }
  }, []) // empty deps = run once on mount
  return (
    <section className="card">
      <h2>4. Fetch from an API</h2>
      <p className="muted">useEffect + loading / error / data - live weather for Boston from Open-Meteo.</p>

      {loading && <p className="empty">Loading...</p>}
      {error && <p className="error">Failed to load: {error}</p>}

      {!loading && !error && weather && (
        <ul className="list">
          <li><strong>Condition</strong> <span className="muted">- {describe(weather.weather_code)}</span></li>
          <li><strong>Temperature</strong> <span className="muted">- {weather.temperature_2m} F</span></li>
          <li><strong>Wind</strong> <span className="muted">- {weather.wind_speed_10m} km/h</span></li>
        </ul>
      )}
    </section>
  )
}
