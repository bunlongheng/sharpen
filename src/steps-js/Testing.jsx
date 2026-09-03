// Step 10: Testing (Vitest + React Testing Library)
// Concept: test behavior the way a user experiences it, not implementation details.
// - render() mounts the component into a jsdom DOM.
// - screen queries find elements the way a user would (by role/text).
// - fireEvent / userEvent simulate interaction; expect() asserts the result.
// Run the suite with:  npm test
// The real, passing tests live in src/steps/__tests__/ - open them in VS Code.
const SAMPLE = `import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ButtonClick from '../ButtonClick'

describe('ButtonClick', () => {
  it('increments the count when clicked', () => {
    render(<ButtonClick />)
    const button = screen.getByText(/clicked 0 times/i)
    fireEvent.click(button)
    expect(screen.getByText(/clicked 1 times/i)).toBeInTheDocument()
  })
})`
export default function Testing() {
  return (
    <section className="card">
      <h2>10. Testing</h2>
      <p className="muted">Vitest + React Testing Library - test behavior, not internals.</p>

      <p>Run the suite in your terminal:</p>
      <pre className="code-block">npm test</pre>

      <p className="muted">
        A real test from this repo (<code>src/steps/__tests__/</code>):
      </p>
      <pre className="code-block">{SAMPLE}</pre>
    </section>
  )
}
