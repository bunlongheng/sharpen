# Step 3: CRUD

**File:** `src/steps/Crud.tsx`

## What you're building

The full lifecycle of a list item: **C**reate, **R**ead, **U**pdate, **D**elete. This is 80% of
real app UI work (todo lists, tables, admin panels...).

## The four operations, in React terms

All four follow the same principle from Step 2: **produce a new array, never mutate.**

### Create
```tsx
setItems((prev) => [...prev, { id: crypto.randomUUID(), value }])
```
Spread the old array, add the new item.

### Read
Just `.map()` over `items` to render them. Reading is "show what's in state."

### Update
```tsx
setItems((prev) => prev.map((it) => (it.id === id ? { ...it, value } : it)))
```
Walk the array. For the matching id, return a **new object** with the changed field
(`{ ...it, value }`). For everyone else, return them unchanged.

### Delete
```tsx
setItems((prev) => prev.filter((it) => it.id !== id))
```
Keep everything whose id doesn't match.

## The clever bit: "edit mode" is just state

How do you make one row turn into a text box when you click Edit? You don't store "isEditing" on
every item. You keep **one** piece of UI state - which id is currently being edited:

```tsx
const [editingId, setEditingId] = useState<string | null>(null)
```

Then in the render: `editingId === item.id ? <input> : <span>`. Clicking Edit sets `editingId`;
clicking Save commits the change and sets it back to `null`.

This is a common interview insight: **derive the UI from a small amount of state** rather than
duplicating flags everywhere.

## Try it yourself

1. Add a "completed" checkbox to each item (another field on the object).
2. Show completed items with a strikethrough.
3. Add a filter: All / Active / Completed.

## Interview questions

- **How do you update one item in a state array?** `map`, return a new object for the match, leave
  the rest as-is.
- **How do you delete?** `filter` out the id.
- **Where does "which row is being edited" live?** In a single piece of component state, not on
  each item.
