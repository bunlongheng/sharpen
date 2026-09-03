// Step 10: Testing (Vitest + React Testing Library)
// Concept: test behavior the way a user experiences it, not implementation details.
// - render() mounts the component into a jsdom DOM.
// - screen queries find elements the way a user would (by role/text).
// - fireEvent / userEvent simulate interaction; expect() asserts the result.
// Run the suite with:  npm test
// The real, passing tests live in src/steps/__tests__/ - open them in VS Code.
// The displayed test IS the real file (imported ?raw) so it can never drift.
import SAMPLE from '../steps/__tests__/ButtonClick.test.tsx?raw'
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
