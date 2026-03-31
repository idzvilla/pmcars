// jest.config.api.ts — used by jest.config.ts projects for API route tests
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  displayName: 'api',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.worktrees/', '/references/'],
  testMatch: [
    '**/__tests__/**/*route*.test.[jt]s?(x)',
  ],
}

export default createJestConfig(config)
