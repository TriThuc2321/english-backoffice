import { expect, test } from '../fixtures/api';
import { FULL_ACCESS } from '../fixtures/data';

test('redirects a logged-out visitor to /login', async ({ page, api }) => {
  await page.goto('/users');

  await expect(page).toHaveURL('/login');
  await expect(
    page.getByRole('button', { name: 'Continue with Google' }),
  ).toBeVisible();
  expect(api.calls('POST', '/auth/refresh')).not.toHaveLength(0);
});

test('shows the login error from the OAuth callback', async ({ page }) => {
  await page.goto('/login?error=cms_access_denied');

  await expect(
    page.getByText('Your account does not have access to the dashboard.'),
  ).toBeVisible();
});

test('ignores an unknown login error code', async ({ page }) => {
  await page.goto('/login?error=something_else');

  await expect(
    page.getByRole('button', { name: 'Continue with Google' }),
  ).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('sends a logged-in user from /login to the dashboard', async ({
  page,
  api,
}) => {
  api.loginAs(FULL_ACCESS);

  await page.goto('/login');

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
