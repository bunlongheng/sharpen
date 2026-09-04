// Auth0 config from Vite env vars (see .env.example). Kept SDK-free so the app shell and
// step 6 can check "is it configured" without pulling @auth0/auth0-react into the entry bundle.
export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN ?? ''
export const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''
export const isAuth0Configured = Boolean(auth0Domain && auth0ClientId)

// Where Auth0 sends the browser back after login/logout: this page, minus the hash
// (the hash route is carried through appState so the round trip lands on the same step).
// Logout deliberately returns here WITHOUT a hash: Auth0 matches Allowed Logout URLs exactly,
// so a fragment is not guaranteed to pass validation - landing on step 1 is the safe default.
export const auth0ReturnTo = window.location.origin + window.location.pathname
