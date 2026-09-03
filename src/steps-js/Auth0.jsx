import { useAuth0 } from '@auth0/auth0-react'
import { isAuth0Configured } from '../auth/Auth0ProviderWrapper'
// Step 6: Auth0 integration
// Concept: authentication as a service. Auth0 handles login, tokens, and the user session;
// you consume it through the useAuth0() hook.
// - Auth0Provider wraps the app (see main.tsx / Auth0ProviderWrapper).
// - useAuth0() gives you: isAuthenticated, user, isLoading, loginWithRedirect, logout, getAccessTokenSilently.
// NOTE: useAuth0 only works inside the provider, so we render the live UI only when configured.
function Auth0Live() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  if (isLoading) return <p className="empty">Checking session...</p>
  return isAuthenticated ? (
    <div>
      <p>
        Signed in as <strong>{user?.name ?? user?.email}</strong>
      </p>
      <div className="row">
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Log out
        </button>
      </div>
    </div>
  ) : (
    <div className="row">
      <button onClick={() => loginWithRedirect()}>Log in with Auth0</button>
      <span className="muted">Redirects to Auth0's Universal Login.</span>
    </div>
  )
}
function Auth0Setup() {
  return (
    <div>
      <p className="error">Auth0 is not configured yet.</p>
      <p className="muted">
        Add these to a <code>.env</code> file, then restart the dev server:
      </p>
      <pre className="code-block">{`VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id`}</pre>
      <p className="muted">
        Create a free "Single Page Application" in the Auth0 dashboard, then add
        <code> http://localhost:5190</code> to Allowed Callback URLs, Logout URLs, and Web Origins.
      </p>
    </div>
  )
}
export default function Auth0() {
  return (
    <section className="card">
      <h2>6. Auth0 integration</h2>
      <p className="muted">Authentication as a service via the useAuth0() hook.</p>

      {isAuth0Configured ? <Auth0Live /> : <Auth0Setup />}
    </section>
  )
}
