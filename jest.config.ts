// jest.config.ts
// Root jest config — uses projects to split UI (jsdom) and API (node) environments
import type { Config } from 'jest'

const config: Config = {
  projects: [
    '<rootDir>/jest.config.ui.ts',
    '<rootDir>/jest.config.api.ts',
  ],
}

export default config
