// Runs before every test file (configured in vite.config.ts).
// Adds custom matchers like toBeInTheDocument() and auto-cleans the DOM between tests.
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
