# Step 4: Fetch from an API

**File:** `src/steps/FetchApi.tsx`

## What you're building

On load, the component fetches the current weather for Boston from Open-Meteo (a free API, no key
needed) and shows it - with proper "Loading..." and error handling.

## New idea: side effects and `useEffect`

Rendering should be pure - just turn state into UI. But fetching data, setting timers, subscribing
to things - those are **side effects**, and they belong in `useEffect`:

```tsx
useEffect(() => {
  // do the side effect here
}, []) // <- dependency array
```

The **dependency array** controls *when* the effect runs:
- `[]` (empty) - run **once**, right after the first render (perfect for "load on mount")
- `[userId]` - run again whenever `userId` changes
- (omitted) - run after *every* render (rarely what you want)

## The three states of every fetch

This is the pattern interviewers want to see. Any data load has exactly three UI states:

```tsx
const [weather, setWeather] = useState<Weather | null>(null) // data
const [loading, setLoading] = useState(true)                 // loading
const [error, setError] = useState<string | null>(null)      // error
```

Beginners only handle the happy path (data). Seniors always handle **all three** - show a spinner
while loading, show a message on error, show data on success.

## Cleanup: the part everyone forgets

What if the component unmounts (user clicks away) *before* the fetch finishes? The response comes
back and tries to `setState` on a component that's gone - a warning and a potential bug.

The fix is the `return` function inside `useEffect` - it runs on cleanup:

```tsx
return () => {
  ignore = true          // don't setState if we've moved on
  controller.abort()     // actually cancel the network request
}
```

The `AbortController` cancels the in-flight request; the `ignore` flag guards any late `setState`.

## Try it yourself

1. Add a "Reload" button that re-runs the fetch (hint: put the fetch in a function you can call).
2. Point it at a bad URL and confirm the error branch shows.
3. Add a city picker that changes latitude/longitude and re-fetches.

## Interview questions

- **What is `useEffect` for?** Side effects - things outside pure rendering (data fetching, timers,
  subscriptions).
- **What does the dependency array do?** Controls when the effect re-runs. `[]` = once on mount.
- **Why clean up?** To cancel in-flight work and avoid setting state after unmount (race conditions).
- **In a real app?** Use React Query / SWR - they handle caching, retries, and loading/error for you.
