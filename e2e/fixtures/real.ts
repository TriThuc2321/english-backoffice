import type { APIRequestContext } from '@playwright/test';

import {
  test as base,
  expect,
  request as playwrightRequest,
} from '@playwright/test';

export const E2E_API_URL =
  process.env.E2E_API_URL ?? 'https://api.myenglish.com:8080';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

export const MISSING_CREDENTIALS =
  'Set E2E_EMAIL and E2E_PASSWORD (a CMS user with a password) to run the real-backend tests. See e2e/README.md.';

export const hasCredentials = !!email && !!password;

/**
 * Log in with email/password. The refresh cookie lands in the request
 * context's cookie jar, which a browser context shares with its pages.
 */
export const login = async (request: APIRequestContext) => {
  const response = await request.post(`${E2E_API_URL}/api/auth/login`, {
    data: { email, password, client: 'bo' },
  });
  expect(response.ok(), await response.text()).toBe(true);
  const { access_token } = (await response.json()) as { access_token: string };
  return access_token;
};

// Every test gets its own session: refresh tokens rotate, and replaying a
// stale one (as a shared storageState would) revokes all of the user's sessions.
export const test = base.extend({
  page: async ({ page, context }, use) => {
    test.skip(!hasCredentials, MISSING_CREDENTIALS);
    await page.addInitScript("localStorage.setItem('locale', 'en')");
    await login(context.request);
    await use(page);
  },
});

export { expect };

/**
 * Delete through the API with its own session, so cleanup runs even when the
 * UI steps failed. Deletes the items of `GET /api/<resource>?search=` that `match`.
 */
export const deleteBySearch = async <T extends { id: string | number }>(
  resource: string,
  search: string,
  match: (item: T) => boolean,
) => {
  if (!hasCredentials) return;
  const api = await playwrightRequest.newContext({ ignoreHTTPSErrors: true });
  try {
    const token = await login(api);
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get(`${E2E_API_URL}/api/${resource}`, {
      headers,
      params: { search, take: 10 },
    });
    const { data = [] } = (await response.json()) as { data?: T[] };
    const ids = data.filter(match).map(({ id }) => id);
    if (ids.length) {
      const deleted = await api.delete(`${E2E_API_URL}/api/${resource}`, {
        headers,
        data: { ids },
      });
      expect(deleted.ok(), await deleted.text()).toBe(true);
    }
  } finally {
    await api.dispose();
  }
};
