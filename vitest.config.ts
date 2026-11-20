import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      'src/lib/user-apis-route.test.ts',
      'src/lib/user-apis-security.test.ts',
      'src/lib/holerites/route-authz.test.ts',
    ],
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
