import { expect, test } from '../fixtures/api';
import { FULL_ACCESS, READ_USERS_ONLY, USERS } from '../fixtures/data';

test.beforeEach(({ api }) => {
  api.on('GET', '/users', {
    body: { data: USERS.slice(0, 10), meta: { totalCount: USERS.length } },
  });
});

test('a read-only user sees the list but no create button or other menus', async ({
  page,
  api,
}) => {
  api.loginAs(READ_USERS_ONLY);

  await page.goto('/users');

  await expect(page.getByText('user1@myenglish.vn')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Roles' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Students' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Create User' })).toHaveCount(
    0,
  );
});

test('manage all shows every menu and the create button', async ({
  page,
  api,
}) => {
  api.loginAs(FULL_ACCESS);

  await page.goto('/users');

  await expect(page.getByText('user1@myenglish.vn')).toBeVisible();
  for (const name of ['Users', 'Roles', 'Students', 'Teachers', 'Tests']) {
    await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Create User' })).toBeVisible();
});
