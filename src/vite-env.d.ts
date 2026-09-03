/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN?: string
  readonly VITE_AUTH0_CLIENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.wasm?url' {
  const src: string
  export default src
}
