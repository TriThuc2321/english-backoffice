import { test as setup } from '@playwright/test';

import {
  E2E_API_URL,
  hasCredentials,
  login,
  MISSING_CREDENTIALS,
} from '../fixtures/real';

// Fail fast, once, when the backend is down or the credentials are wrong,
// instead of every real test failing the same way.
setup(
  'backend is reachable and the credentials log in',
  async ({ page, request }) => {
    setup.skip(!hasCredentials, MISSING_CREDENTIALS);

    const health = await request
      .get(`${E2E_API_URL}/api`, { failOnStatusCode: false })
      .catch(() => null);
    if (!health) {
      throw new Error(
        `english-service is not reachable at ${E2E_API_URL}. Start it first.`,
      );
    }

    await page.goto('/login');
    await login(page.request);
  },
);
