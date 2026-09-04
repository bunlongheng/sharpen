import { Auth0Provider } from '@auth0/auth0-react'
import type { ReactNode } from 'react'
import { auth0Domain, auth0ClientId, auth0ReturnTo } from './config'

// Only mounted (lazily, see App.tsx) when VITE_AUTH0_DOMAIN + VITE_AUTH0_CLIENT_ID are set,
// so the Auth0 SDK never ships to visitors who have not configured it.
// Step 6 detects the unconfigured case via isAuth0Configured and renders a setup guide instead.
export default function Auth0ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{ redirect_uri: auth0ReturnTo }}
      // land back on the lesson the user logged in from (see Auth0.tsx loginWithRedirect appState)
      onRedirectCallback={(appState) => {
        // strip ?code&state (like the SDK default) AND restore the lesson hash in one replaceState,
        // so a refresh after login never replays a consumed auth transaction
        const hash = (appState?.returnTo as string | undefined) ?? '#react/6'
        window.history.replaceState({}, document.title, window.location.pathname + hash)
        // replaceState does not emit hashchange - tell useHashRoute the lesson changed
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }}
    >
      {children}
    </Auth0Provider>
  )
}
