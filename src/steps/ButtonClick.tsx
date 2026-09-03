import { useState } from 'react'

// Step 1: Button click
// Concept: useState + an event handler. The whole foundation of React interactivity.
// - State is the single source of truth for what the UI shows.
// - You never mutate state directly. You call the setter, React re-renders.
export default function ButtonClick() {
  // useState<number> is inferred from the initial value 0.
  const [count, setCount] = useState(0)

  return (
    <section className="card">
      <h2>1. Button click</h2>
      <p className="muted">Click the button, watch state drive the render.</p>

      <div className="row">
        <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
        <button className="ghost" onClick={() => setCount(0)} disabled={count === 0}>Reset</button>
      </div>
    </section>
  )
}
