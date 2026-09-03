import { Component, type ReactNode } from 'react'

// Catches a throw inside any lesson component so one broken step
// degrades to an inline error instead of white-screening the whole app.
// A failed lazy chunk (typically a stale tab after a redeploy) cannot be retried
// in place - React.lazy caches the rejection - so that case offers a reload instead.
const CHUNK_ERROR = /dynamically imported module|Loading chunk|Failed to fetch/i

export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    const { error } = this.state
    if (error) {
      const stale = CHUNK_ERROR.test(error.message)
      return (
        <section className="card">
          <p className="error">
            {stale
              ? 'This lesson could not be downloaded (the app was updated).'
              : `This step crashed: ${error.message}`}
          </p>
          {stale ? (
            <button onClick={() => window.location.reload()}>Reload</button>
          ) : (
            <button onClick={() => this.setState({ error: null })}>Try again</button>
          )}
        </section>
      )
    }
    return this.props.children
  }
}
