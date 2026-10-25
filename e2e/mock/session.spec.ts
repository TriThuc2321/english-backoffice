import { ACCESS_TOKEN, expect, test, unauthorized } from '../fixtures/api';
import { FULL_ACCESS, USERS } from '../fixtures/data';

const usersPage = {
  body: { data: USERS.slice(0, 10), meta: { totalCount: USERS.length } },
};

test('refreshes an expired token and retries the request', async ({
  page,
  api,
}) => {
  api.loginAs(FULL_ACCESS);
  let expired = true;
  api.on('GET', '/users', () => {
    if (expired) {
      expired = false;
      return unauthorized;
    }
    return usersPage;
  });

  await page.goto('/users');

  await expect(page.getByText('user1@myenglish.vn')).toBeVisible();
  await expect(page).toHaveURL('/users');
  // One refresh on page load, one for the expired list request
  expect(api.calls('POST', '/auth/refresh')).toHaveLength(2);
  expect(api.calls('GET', '/users')).toHaveLength(2);
});

test('sends the user to /login when the refresh fails', async ({
  page,
  api,
}) => {
  api.loginAs(FULL_ACCESS);
  // The session is valid on load, then the refresh cookie is revoked
  let refreshes = 0;
  api.on('POST', '/auth/refresh', () =>
    refreshes++ === 0 ? { body: { access_token: ACCESS_TOKEN } } : unauthorized,
  );
  api.on('GET', '/users', unauthorized);

  await page.goto('/users');

  await expect(page).toHaveURL('/login');
  await expect(
    page.getByRole('button', { name: 'Continue with Google' }),
  ).toBeVisible();
});
