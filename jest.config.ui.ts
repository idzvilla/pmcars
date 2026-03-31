// jest.config.ui.ts — UI component tests (jsdom environment)
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  displayName: 'ui',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.worktrees/', '/references/'],
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '!**/__tests__/**/*route*.test.[jt]s?(x)',
  ],
}

export default createJestConfig(config)
