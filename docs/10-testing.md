# Step 10: Testing

**File:** `src/steps/Step10Testing.tsx` + real tests in `src/steps/__tests__/`

## What you're building

Automated tests that click the Step 1 button and assert the count went up - proving the component
works without you manually clicking every time.

## The tools

- **Vitest** - the test runner (like Jest, but built for Vite). Runs your tests and reports pass/fail.
- **React Testing Library (RTL)** - renders components into a fake DOM and lets you query them the way
  a *user* would.

Run everything with:

```bash
npm test
```

## The golden rule: test behavior, not internals

Bad tests check *how* the code works (state variables, function names). Good tests check *what the
user experiences*. If you refactor the internals but the behavior is the same, good tests keep passing.

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Step1ButtonClick from '../Step1ButtonClick'

describe('Step1ButtonClick', () => {
  it('increments the count when clicked', () => {
    render(<Step1ButtonClick />)                         // 1. mount it
    fireEvent.click(screen.getByText(/clicked 0 times/i)) // 2. act like a user
    expect(screen.getByText(/clicked 1 times/i)).toBeInTheDocument() // 3. assert
  })
})
```

Every test is the same 3 beats: **render -> interact -> assert.**

## Choosing a query

RTL queries mirror how people and screen readers find things - prefer role and text over test-ids:

- `getByRole('button', { name: /add/i })` - best; how assistive tech sees it
- `getByText(/clicked/i)` - find by visible text
- `getByPlaceholderText(...)`, `getByLabelText(...)` - for form fields

Three prefixes, three behaviors:
- `getBy*` - throws if not found (asserting it exists)
- `queryBy*` - returns `null` if not found (asserting it does **not** exist)
- `findBy*` - async, waits for it to appear (for things that load later)

## fireEvent vs userEvent

`fireEvent.click` fires a single raw event. `userEvent` (from `@testing-library/user-event`) simulates
real user behavior more faithfully (focus, key events, typing character by character). Prefer
`userEvent` in real projects; we use `fireEvent` here to keep dependencies minimal.

## Try it yourself

1. Open `src/steps/__tests__/Step2AddToList.test.tsx` and add a test for adding two items.
2. Write a test asserting the empty message is gone after adding an item (hint: `queryByText`).
3. Run `npm run test:watch` and watch tests re-run as you edit.

## Interview questions

- **What do you test - implementation or behavior?** Behavior, the way a user experiences it.
- **getBy vs queryBy vs findBy?** Throws / returns null / async-waits. Use queryBy to assert absence.
- **Why query by role/text over test-id?** It tests the accessible UI users actually interact with.
- **fireEvent vs userEvent?** userEvent simulates realistic interaction; prefer it.
