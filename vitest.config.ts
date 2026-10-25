import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// Same origin for the page and the API, so jsdom skips CORS checks on requests
const TEST_ORIGIN = 'https://backoffice.myenglish.com:5173';

// Kept separate from vite.config.ts: the reactRouter() plugin does not run under Vitest.
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: TEST_ORIGIN },
    },
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    env: {
      VITE_API_URL: TEST_ORIGIN,
    },
    coverage: {
      provider: 'v8',
      include: [
        'src/utils/**',
        'src/schemas/**',
        'src/services/**',
        'src/configs/**',
        'src/constants/**',
        'src/hooks/**',
      ],
    },
  },
});
