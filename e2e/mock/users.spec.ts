import { expect, test } from '../fixtures/api';
import { FULL_ACCESS, makeUser, ROLES, USERS } from '../fixtures/data';

test.beforeEach(({ api }) => {
  api.loginAs(FULL_ACCESS);
  api.on('GET', '/users', ({ query }) => {
    const page = Number(query.get('page') ?? 1);
    const take = Number(query.get('take') ?? 10);
    return {
      body: {
        data: USERS.slice((page - 1) * take, page * take),
        meta: { page, take, totalCount: USERS.length },
      },
    };
  });
  api.on('GET', '/roles', {
    body: { data: ROLES, meta: { totalCount: ROLES.length } },
  });
});

test('lists users and paginates with page/take', async ({ page, api }) => {
  await page.goto('/users');

  await expect(page.getByText('user1@myenglish.vn')).toBeVisible();
  await expect(page.getByText('/ 25 items')).toBeVisible();
  const [first] = api.calls('GET', '/users');
  expect(first.query.get('page')).toBe('1');
  expect(first.query.get('take')).toBe('10');

  await page.getByRole('button', { name: '2', exact: true }).click();

  await expect(page).toHaveURL(/[?&]page=2/);
  await expect(page.getByText('user11@myenglish.vn')).toBeVisible();
  await expect(page.getByText('user1@myenglish.vn')).toHaveCount(0);
  expect(api.calls('GET', '/users').at(-1)?.query.get('page')).toBe('2');
});

test('validates and creates a user', async ({ page, api }) => {
  const created = makeUser(99, {
    id: 'new-user',
    email: 'new.user@myenglish.vn',
    firstName: 'New',
    lastName: 'User',
  });
  api.on('POST', '/users', { status: 201, body: created });
  api.on('GET', '/users/:id', ({ params }) =>
    params.id === created.id
      ? { body: created }
      : { status: 404, body: { message: 'Not found' } },
  );

  await page.goto('/users/create');
  await page.getByRole('button', { name: 'Save' }).click();

  // email, first name, last name and role are required
  await expect(page.getByText('This field is required')).toHaveCount(4);
  expect(api.calls('POST', '/users')).toHaveLength(0);

  await page.getByRole('textbox', { name: 'First Name' }).fill('New');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await page.getByRole('textbox', { name: 'Email' }).fill('not-an-email');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Invalid email')).toBeVisible();
  expect(api.calls('POST', '/users')).toHaveLength(0);

  await page
    .getByRole('textbox', { name: 'Email' })
    .fill('new.user@myenglish.vn');
  await page.getByRole('button', { name: /Role/ }).click();
  await page.getByRole('option', { name: 'Teacher' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('User created successfully')).toBeVisible();
  await expect(page).toHaveURL(`/users/${created.id}`);
  const [post] = api.calls('POST', '/users');
  expect(post.body).toMatchObject({
    email: 'new.user@myenglish.vn',
    firstName: 'New',
    lastName: 'User',
    roleId: 2,
  });
});

test('deletes a user after confirming', async ({ page, api }) => {
  api.on('DELETE', '/users', { body: { message: 'Deleted' } });

  await page.goto('/users');
  const row = page.getByRole('row').filter({ hasText: 'user1@myenglish.vn' });
  await expect(row).toBeVisible();

  // Desktop actions: view, edit, delete
  await row.getByRole('button').nth(2).click();
  await expect(page.getByText('Delete user')).toBeVisible();
  expect(api.calls('DELETE', '/users')).toHaveLength(0);
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByText('User deleted successfully')).toBeVisible();
  const [request] = api.calls('DELETE', '/users');
  expect(request.body).toEqual({ ids: ['user-1'] });
  // The list is refetched after the delete
  await expect.poll(() => api.calls('GET', '/users').length).toBeGreaterThan(1);
});

test('searches with a debounce and resets to page 1', async ({ page, api }) => {
  await page.goto('/users?page=3');
  await expect(page.getByText('user21@myenglish.vn')).toBeVisible();

  await page.getByRole('textbox', { name: 'Search users' }).fill('ada');

  await expect
    .poll(() => api.calls('GET', '/users').at(-1)?.query.get('search'))
    .toBe('ada');
  const searches = api
    .calls('GET', '/users')
    .map((call) => call.query.get('search'))
    .filter(Boolean);
  expect(searches).toEqual(['ada']);
  await expect(page).toHaveURL(/[?&]page=1(&|$)/);
  expect(api.calls('GET', '/users').at(-1)?.query.get('page')).toBe('1');
});

test('shows the user detail', async ({ page, api }) => {
  const user = makeUser(7, {
    phone: '0901234567',
    address: '1 Le Loi, District 1',
  });
  api.on('GET', '/users/:id', { body: user });

  await page.goto(`/users/${user.id}`);

  await expect(page.getByText('user7@myenglish.vn')).toBeVisible();
  await expect(page.getByText('0901234567')).toBeVisible();
  await expect(page.getByText('1 Le Loi, District 1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
});

test('edits a user with the form pre-filled', async ({ page, api }) => {
  const user = makeUser(7, { phone: '0901234567' });
  api.on('GET', '/users/:id', { body: user });
  api.on('PATCH', '/users/:id', ({ body }) => ({
    body: { ...user, ...(body as object) },
  }));

  await page.goto(`/users/${user.id}/edit`);

  const lastName = page.getByRole('textbox', { name: 'Last Name' });
  await expect(lastName).toHaveValue('7');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
    'user7@myenglish.vn',
  );
  await lastName.fill('Seven');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('User updated successfully')).toBeVisible();
  await expect(page).toHaveURL(`/users/${user.id}`);
  const [patch] = api.calls('PATCH', '/users/:id');
  expect(patch.path).toBe(`/users/${user.id}`);
  expect(patch.body).toMatchObject({
    email: 'user7@myenglish.vn',
    firstName: 'User',
    lastName: 'Seven',
    phone: '0901234567',
    roleId: ROLES[1].id,
    status: 'ACTIVE',
  });
});

test('a system user cannot be deleted', async ({ page, api }) => {
  api.on('GET', '/users', {
    body: {
      data: [makeUser(1, { systemUser: true }), makeUser(2)],
      meta: { page: 1, take: 10, totalCount: 2 },
    },
  });

  await page.goto('/users');

  const system = page
    .getByRole('row')
    .filter({ hasText: 'user1@myenglish.vn' });
  const regular = page
    .getByRole('row')
    .filter({ hasText: 'user2@myenglish.vn' });
  await expect(system.getByRole('button').nth(2)).toBeDisabled();
  await expect(regular.getByRole('button').nth(2)).toBeEnabled();
});

test('keeps the form and shows the API error when creating fails', async ({
  page,
  api,
}) => {
  api.on('POST', '/users', {
    status: 409,
    body: { statusCode: 409, message: 'Email already exists' },
  });

  await page.goto('/users/create');
  await page.getByRole('textbox', { name: 'First Name' }).fill('Dup');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await page.getByRole('textbox', { name: 'Email' }).fill('user1@myenglish.vn');
  await page.getByRole('button', { name: /Role/ }).click();
  await page.getByRole('option', { name: 'Teacher' }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Failed to create user')).toBeVisible();
  await expect(page.getByText('Email already exists')).toBeVisible();
  await expect(page).toHaveURL('/users/create');
});
