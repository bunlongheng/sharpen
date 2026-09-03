import { Component, type ReactNode } from 'react'

// Catches a throw inside any lesson component so one broken step
// degrades to an inline error instead of white-screening the whole app.
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <section className="card">
          <p className="error">This step crashed: {this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}>Try again</button>
        </section>
      )
    }
    return this.props.children
  }
}
