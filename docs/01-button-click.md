# Step 1: Button Click

**File:** `src/steps/ButtonClick.tsx`

## What you're building

A button that counts how many times you clicked it. That's it. But this tiny example is the
foundation of *everything* in React.

## The one idea: state drives the screen

In plain HTML/JS you grab an element and change it: `document.getElementById(...).innerText = ...`.

React flips this around. You keep a value called **state**, and React automatically re-draws the
screen whenever that value changes. You never touch the DOM by hand.

```tsx
const [count, setCount] = useState(0)
```

- `count` - the current value (starts at 0)
- `setCount` - the ONLY way you're allowed to change it
- `useState(0)` - a **hook** that gives you both, with a starting value of 0

When you call `setCount(5)`, React re-runs your component and paints the new number. Magic, but
predictable.

## Reading the code

```tsx
<button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
<button className="ghost" onClick={() => setCount(0)} disabled={count === 0}>Reset</button>
```

- `onClick={...}` - run this function when clicked
- `() => setCount((c) => c + 1)` - "take the latest count and add 1"
- `{count}` - curly braces drop a JS value into the HTML (this is JSX)
- The Reset button calls `setCount(0)` and is `disabled` while the count is already 0 - state
  drives the UI in both directions.

## The gotcha interviewers love

Notice the button uses `setCount((c) => c + 1)`, not `setCount(count + 1)`. Why?

Because React batches updates. If you called `setCount(count + 1)` three times in a row, they'd
all read the same stale `count` and you'd only go up by 1. The **functional form** `c => c + 1`
always gets the latest value, so it's safe. **Rule: if the new value depends on the old value,
use the function form.**

## Try it yourself

1. Add a "-1" button.
2. Make the counter never go below 0 (hint: `Math.max(0, ...)`).
3. Add a second, independent counter. Notice each `useState` is its own separate value.

## Interview questions

- **What is state?** Data that, when it changes, causes the component to re-render.
- **Why not just use a normal variable?** A normal variable doesn't trigger a re-render, so the
  screen wouldn't update.
- **When do you use the functional updater?** When the next value depends on the previous one.
