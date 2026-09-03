# Step 6: Auth0 Integration

**File:** `src/steps/Auth0.tsx` (plus `src/auth/Auth0ProviderWrapper.tsx`)

## What you're building

A real login/logout flow using Auth0 - a service that handles authentication so you don't have to
store passwords yourself.

## Why use a service like Auth0?

Authentication is easy to get wrong and dangerous when you do (leaked passwords, broken sessions).
Auth0 (and Clerk, Cognito, Firebase Auth, etc.) handle the hard, security-critical parts: the login
UI, password storage, social logins, tokens, and sessions. You just consume the result.

## The two pieces

### 1. The Provider (wraps your whole app)
In `src/auth/Auth0ProviderWrapper.tsx`, `<Auth0Provider>` wraps the app and holds the auth session.
It reads your Auth0 credentials from environment variables:

```
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
```

(The app runs fine without them - Step 6 just shows setup instructions until you add a `.env` file.)

### 2. The hook (read auth anywhere)
```tsx
const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
```

- `isLoading` - still checking the session? show a spinner
- `isAuthenticated` - true/false
- `user` - the logged-in user's profile (name, email, picture)
- `loginWithRedirect()` - sends the user to Auth0's login page
- `logout()` - ends the session

## The critical security lesson

**The frontend can never be trusted.** Hiding a button when `isAuthenticated` is false is a UX nicety,
not security - anyone can edit the JS in their browser.

Real protection happens on the **server**: your frontend gets an access token
(`getAccessTokenSilently()`), sends it with each API request, and your backend **validates that JWT**
before returning data. Gate the UI on `isAuthenticated`; gate the *data* on the verified token.

SPAs use the **Authorization Code flow with PKCE** - there's no client secret in the browser (there
can't be, browsers can't keep secrets).

## Setting it up (optional, to see live login)

1. Sign up free at auth0.com, create a **Single Page Application**.
2. Copy `.env.example` to `.env`, paste your Domain and Client ID.
3. In the Auth0 dashboard, add `http://localhost:5190` to Allowed Callback URLs, Logout URLs, and
   Web Origins.
4. Restart `npm run dev`. The Log in button now works.

## Interview questions

- **Why use a hosted auth provider?** Security, speed, and features (social login, MFA) you'd
  otherwise build and maintain yourself.
- **Where does real authorization happen - client or server?** Server. The client just holds a token
  and shows/hides UI.
- **What's PKCE?** A way for public clients (SPAs, mobile) to do the OAuth code flow safely without a
  client secret.
- **What do you send to your API?** The access token; the API validates the JWT signature and claims.
