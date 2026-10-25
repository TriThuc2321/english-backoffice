import { expect, test } from '../fixtures/api';
import {
  FULL_ACCESS,
  PASSAGES,
  READ_PASSAGES_ONLY,
  READ_ROLES_ONLY,
  READ_USERS_ONLY,
  ROLES,
  USERS,
} from '../fixtures/data';

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

test('the passages menu follows the passage permission, not test', async ({
  page,
  api,
}) => {
  api.loginAs(READ_PASSAGES_ONLY);
  api.on('GET', '/passages', {
    body: { data: PASSAGES.slice(0, 10), meta: { totalCount: 10 } },
  });

  await page.goto('/passages');

  await expect(page.getByRole('link', { name: 'Passages' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Tests', exact: true }),
  ).toHaveCount(0);
});

test('a read-test user does not see the passages menu', async ({
  page,
  api,
}) => {
  api.loginAs([
    { action: 'read', subject: 'dashboard' },
    { action: 'read', subject: 'test' },
  ]);

  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Tests', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Passages' })).toHaveCount(0);
});

test('a read-only role user cannot create, edit or delete roles', async ({
  page,
  api,
}) => {
  api.loginAs(READ_ROLES_ONLY);
  api.on('GET', '/roles', {
    body: { data: ROLES, meta: { totalCount: ROLES.length } },
  });

  await page.goto('/roles');

  const row = page.getByRole('row').filter({ hasText: 'TEACHER' });
  await expect(row).toBeVisible();
  // Only the view action is rendered
  await expect(row.getByRole('button')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Create Role' })).toHaveCount(
    0,
  );
  await expect(page.getByRole('link', { name: 'Users' })).toHaveCount(0);
});

test('a read-only passage user cannot create, edit, publish or delete', async ({
  page,
  api,
}) => {
  const passage = PASSAGES[0];
  api.loginAs(READ_PASSAGES_ONLY);
  api.on('GET', '/passages', {
    body: { data: PASSAGES.slice(0, 10), meta: { totalCount: 10 } },
  });
  api.on('GET', '/passages/:id', { body: passage });

  await page.goto('/passages');

  const row = page.getByRole('row', { name: passage.title, exact: true });
  await expect(row).toBeVisible();
  await expect(row.getByRole('button')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Create Passage' }),
  ).toHaveCount(0);

  await row.getByRole('button').first().click();

  await expect(page).toHaveURL(`/passages/${passage.id}`);
  await expect(
    page.getByRole('heading', { name: passage.title! }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Publish' })).toHaveCount(0);
});
