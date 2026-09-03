// Step 10: Testing (Vitest + React Testing Library)
// Concept: test behavior the way a user experiences it, not implementation details.
// - render() mounts the component into a jsdom DOM.
// - screen queries find elements the way a user would (by role/text).
// - fireEvent / userEvent simulate interaction; expect() asserts the result.
// Run the suite with:  npm test
// The real, passing tests live in src/steps/__tests__/ - open them in VS Code.
const SAMPLE = `import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Step1ButtonClick from '../Step1ButtonClick'

describe('Step1ButtonClick', () => {
  it('increments the count when clicked', () => {
    render(<Step1ButtonClick />)
    const button = screen.getByText(/clicked 0 times/i)
    fireEvent.click(button)
    expect(screen.getByText(/clicked 1 times/i)).toBeInTheDocument()
  })
})`

export default function Step10Testing() {
  return (
    <section className="card">
      <h2>10. Testing</h2>
      <p className="muted">Vitest + React Testing Library - test behavior, not internals.</p>

      <p>Run the suite in your terminal:</p>
      <pre className="code-block">npm test</pre>

      <p className="muted">A real test from this repo (<code>src/steps/__tests__/</code>):</p>
      <pre className="code-block">{SAMPLE}</pre>

      <details className="notes">
        <summary>Interview notes</summary>
        <ul>
          <li>Query by role/text (<code>getByRole</code>, <code>getByText</code>) - it mirrors how users and screen readers find things.</li>
          <li><code>getBy*</code> throws if missing, <code>queryBy*</code> returns null (assert absence), <code>findBy*</code> is async (awaits appearance).</li>
          <li>Prefer <code>userEvent</code> over <code>fireEvent</code> for realistic interactions.</li>
          <li>Test what the user sees and does; avoid asserting on state or internal function calls.</li>
        </ul>
      </details>
    </section>
  )
}
