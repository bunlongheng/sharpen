# Step 9: React Router

**File:** `src/steps/Router.tsx`

## What you're building

A mini app with Home, About, and a **protected** Dashboard page - navigating between them without
the browser ever doing a full page reload. Plus a login toggle that guards the dashboard.

## What is client-side routing?

A normal website loads a fresh HTML page from the server for every URL. A **single-page app** (SPA)
loads once, then JavaScript swaps the content when the URL changes - instant, no white flash.
React Router is the library that maps URLs to components.

## The core pieces

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<p>404</p>} />
</Routes>
```

- `<Routes>` + `<Route>` = the URL-to-component map. `path="*"` catches everything else (404).
- `<Link to="/about">` = navigate without a reload (use this instead of `<a href>`).
- `<Navigate to="/login" />` = redirect programmatically.

## The protected route pattern

This is the interview favorite. A protected route is just a wrapper that checks auth and either
renders the page or redirects:

```tsx
function RequireAuth({ authed, children }) {
  if (!authed) return <Navigate to="/login" replace />
  return <>{children}</>
}

<Route path="/dashboard" element={
  <RequireAuth authed={authed}><Dashboard /></RequireAuth>
} />
```

In a real app, `authed` would come from `useAuth0().isAuthenticated` (Step 6). We also pass the
attempted path via `state` so you can send the user back where they wanted to go after they log in.

## Why MemoryRouter here?

Normally you wrap your app **once** at the root in `<BrowserRouter>` (it uses the browser's real URL
bar / History API). But this demo lives inside our tab shell, which already owns the address bar. So
we use `<MemoryRouter>` - it keeps its own history in memory and doesn't touch the real URL. Same API,
isolated. (MemoryRouter is also what you use in tests.)

## Try it yourself

1. Add a `/profile/:id` route and read the id with `useParams()`.
2. Add a "Go home" button using `useNavigate()` instead of a `<Link>`.
3. Wire the login toggle to Auth0's `isAuthenticated` from Step 6.

## Interview questions

- **BrowserRouter vs MemoryRouter vs HashRouter?** Browser = History API (clean URLs, needs server
  config); Hash = `#/path` (no server config); Memory = in-memory (tests, embedded).
- **How do you protect a route?** A wrapper component that checks auth and `<Navigate>`s away if not
  allowed.
- **`Link` vs `a`?** `Link` does client-side navigation (no reload); `a` triggers a full page load.
- **How do you read URL params / query strings?** `useParams()` and `useSearchParams()`.
