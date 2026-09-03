# Step 5: Custom Hooks + Context

**File:** `src/steps/Step5HooksContext.tsx` (plus `src/hooks/useLocalStorage.ts` and `src/context/ThemeContext.tsx`)

## What you're building

A theme toggle (light/dark) that every component can read, and a note box that remembers what you
typed even after you refresh the page. Two big concepts in one step.

## Concept A: custom hooks (reuse logic)

A **custom hook** is just a function whose name starts with `use` and that calls other hooks. It
lets you package up stateful logic and reuse it anywhere.

Our `useLocalStorage` behaves like `useState`, but it also saves to the browser's localStorage:

```tsx
const [note, setNote] = useLocalStorage<string>('rip-note', '')
```

Same shape as `useState`, but the value survives a page refresh. Look inside
`src/hooks/useLocalStorage.ts`:
- It reads the saved value once on first render (a "lazy initializer" - the function form of
  `useState`).
- A `useEffect` writes back to localStorage whenever the value changes.

Key insight: **hooks share logic, not state.** If two components both call `useLocalStorage`, each
gets its own independent value. You're reusing the *behavior*, not a shared variable.

## Concept B: Context (share state without prop drilling)

Imagine the theme needs to be read by a component 5 levels deep. Passing `theme` down through every
component in between is "prop drilling" - tedious and fragile.

**Context** lets you put a value at the top and read it anywhere below, no props required. Three steps
(see `src/context/ThemeContext.tsx`):

1. **Create** it: `createContext<...>(null)`
2. **Provide** it: wrap your tree in `<ThemeProvider>` (App.tsx does this)
3. **Consume** it: any component calls `useTheme()` to read `{ theme, toggle }`

```tsx
const { theme, toggle } = useTheme()
```

No matter how deep the component is, it gets the theme directly.

## Why the custom `useTheme()` wrapper?

Instead of exposing raw `useContext`, we wrap it so it throws a clear error if you forget the
Provider. This is a common, clean pattern.

## Try it yourself

1. Write a `useToggle` custom hook (`const [on, toggle] = useToggle(false)`).
2. Add a second value to the theme context (e.g. an accent color).
3. Add another component that reads `useTheme()` and confirm it updates too.

## Interview questions

- **What makes something a custom hook?** A function starting with `use` that calls other hooks.
- **Do two callers of a custom hook share state?** No - each gets its own. Hooks reuse logic.
- **What problem does Context solve?** Prop drilling - passing data through many layers.
- **Context downside?** Every consumer re-renders when the value changes. Split contexts or memoize
  the value. Context is not a full state manager (that's Redux/Zustand/Jotai).
