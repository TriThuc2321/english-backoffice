import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
// Set by `pnpm e2e:real`: the real project runs against servers already up
const isReal = !!process.env.E2E_REAL;

// Mock mode runs its own dev server on a separate port, so it never clashes
// with the HTTPS dev server a developer keeps on 5173.
const MOCK_PORT = 5174;
const MOCK_ORIGIN = `http://localhost:${MOCK_PORT}`;

const REAL_BASE_URL =
  process.env.E2E_BASE_URL ?? 'https://backoffice.myenglish.com:5173';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    locale: 'en-US',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mock',
      testMatch: 'mock/**/*.spec.ts',
      use: { baseURL: MOCK_ORIGIN },
    },
    {
      name: 'real-setup',
      testMatch: 'real/auth.setup.ts',
      fullyParallel: false,
      use: { baseURL: REAL_BASE_URL, ignoreHTTPSErrors: true },
    },
    {
      name: 'real',
      testMatch: 'real/**/*.spec.ts',
      dependencies: ['real-setup'],
      // Shares one DB and a throttled login endpoint, so keep it sequential
      fullyParallel: false,
      use: { baseURL: REAL_BASE_URL, ignoreHTTPSErrors: true },
    },
  ],
  // Only the mock project needs a server; real mode expects the developer's
  // dev server and english-service to be running already.
  webServer: isReal
    ? undefined
    : {
        command: `pnpm dev --port ${MOCK_PORT} --strictPort`,
        url: MOCK_ORIGIN,
        reuseExistingServer: !isCI,
        timeout: 120_000,
        env: {
          E2E: '1',
          // Same origin as the page, so page.route() catches every API call
          VITE_API_URL: MOCK_ORIGIN,
        },
      },
});
