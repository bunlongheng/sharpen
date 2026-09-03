/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves the app under /sharpen/ - CI sets GHPAGES=1 for that build
  base: process.env.GHPAGES ? '/sharpen/' : '/',
  plugins: [react()],
  server: { port: 5190 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
