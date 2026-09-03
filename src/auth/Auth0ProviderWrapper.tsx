import { Auth0Provider } from '@auth0/auth0-react'
import type { ReactNode } from 'react'

// Reads Auth0 config from Vite env vars (see .env.example).
// The app still runs without them - Step 6 shows setup instructions instead of live buttons.
const domain = import.meta.env.VITE_AUTH0_DOMAIN ?? ''
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID ?? ''

export const isAuth0Configured = Boolean(domain && clientId)

export function Auth0ProviderWrapper({ children }: { children: ReactNode }) {
  // Without real config, skip the provider entirely so nothing tries to hit Auth0.
  // Step 6 detects this via isAuth0Configured and renders a setup guide.
  if (!isAuth0Configured) return <>{children}</>

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      {children}
    </Auth0Provider>
  )
}
