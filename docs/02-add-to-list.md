# Step 2: Add to a List

**File:** `src/steps/Step2AddToList.tsx`

## What you're building

A text box + Add button. Type something, hit Add, it appears in a list below.

## New idea #1: the controlled input

The text box's value lives in **state**, not in the DOM:

```tsx
const [text, setText] = useState('')
...
<input value={text} onChange={(e) => setText(e.target.value)} />
```

- `value={text}` - the box always shows whatever `text` is
- `onChange={...}` - every keystroke updates `text`

This is called a **controlled component**: React is the single source of truth for what's in the
box. Sounds like extra work, but it means you can validate, transform, or clear the input trivially.

## New idea #2: never mutate state

To add an item you might reach for `items.push(newItem)`. **Don't.** React decides whether to
re-render by checking if the array is a *new* reference. `.push()` changes the same array, so React
sees "same array, nothing to do" and the screen won't update.

Instead, make a **new** array:

```tsx
setItems((prev) => [...prev, { id: crypto.randomUUID(), value }])
```

`[...prev, newItem]` = "everything that was there, plus the new one" - a brand new array. This is
the golden rule: **treat state as read-only; always produce a new value.**

## New idea #3: keys

```tsx
{items.map((item) => <li key={item.id}>{item.value}</li>)}
```

When you render a list, React needs a stable `key` on each item to track which is which across
re-renders. Use a real unique id (`crypto.randomUUID()`), **not** the array index - the index
breaks the moment you insert, remove, or reorder items.

## Why `e.preventDefault()`?

The input is inside a `<form>`. Submitting a form reloads the page by default, which would wipe
your React state. `e.preventDefault()` stops that.

## Try it yourself

1. Prevent adding blank/whitespace-only items (already done - see the `.trim()` check).
2. Add a "clear all" button.
3. Show a count: "3 items".

## Interview questions

- **Controlled vs uncontrolled input?** Controlled = value from state. Uncontrolled = value lives
  in the DOM, read via a ref. Controlled is the default recommendation.
- **Why not push to a state array?** React compares references; mutating gives the same reference,
  so no re-render.
- **Why not use the index as a key?** It's unstable when the list changes, causing wrong items to
  update and subtle bugs.
