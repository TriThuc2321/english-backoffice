import type { Page } from '@playwright/test';

import { expect, test } from '../fixtures/api';
import {
  FULL_ACCESS,
  makeRole,
  paginate,
  PERMISSIONS,
  permissionId,
} from '../fixtures/data';

const SYSTEM_ROLE = makeRole({
  id: 1,
  name: 'Super Admin',
  code: 'SUPER_ADMIN',
  systemRole: true,
  permissions: FULL_ACCESS,
});

const EDITOR = makeRole({
  id: 2,
  name: 'Editor',
  code: 'EDITOR',
  canAccessCms: true,
  permissions: [
    { action: 'manage', subject: 'user' },
    { action: 'read', subject: 'role' },
  ],
});

const ROLES = [
  SYSTEM_ROLE,
  EDITOR,
  ...Array.from({ length: 13 }, (_, i) =>
    makeRole({ id: i + 3, name: `Role ${i + 3}`, code: `ROLE_${i + 3}` }),
  ),
];

// React Aria hides the native input, so click the label that wraps it
const toggle = (page: Page, role: 'checkbox' | 'switch', name: string) =>
  page.getByRole(role, { name }).locator('xpath=ancestor::label[1]').click();

test.beforeEach(({ api }) => {
  api.loginAs(FULL_ACCESS);
  api.on('GET', '/roles', paginate(ROLES));
  api.on('GET', '/roles/:id', ({ params }) => {
    const role = ROLES.find(({ id }) => String(id) === params.id);
    return role
      ? { body: role }
      : { status: 404, body: { message: 'Not found' } };
  });
  api.on('GET', '/permissions', { body: PERMISSIONS });
});

test('lists roles, paginates and searches', async ({ page, api }) => {
  await page.goto('/roles');

  await expect(
    page.getByRole('gridcell', { name: 'SUPER_ADMIN' }),
  ).toBeVisible();
  await expect(page.getByText('/ 15 items')).toBeVisible();

  await page.getByRole('button', { name: '2', exact: true }).click();

  await expect(page).toHaveURL(/[?&]page=2/);
  await expect(page.getByRole('gridcell', { name: 'ROLE_11' })).toBeVisible();
  expect(api.calls('GET', '/roles').at(-1)?.query.get('page')).toBe('2');

  await page.getByRole('textbox', { name: 'Search roles' }).fill('edit');

  // Debounced: only the final term reaches the API
  await expect
    .poll(() => api.calls('GET', '/roles').at(-1)?.query.get('search'))
    .toBe('edit');
  const searches = api
    .calls('GET', '/roles')
    .map((call) => call.query.get('search'))
    .filter(Boolean);
  expect(searches).toEqual(['edit']);
});

test('validates and creates a role with permissions', async ({ page, api }) => {
  api.on('POST', '/roles', ({ body }) => ({
    status: 201,
    body: makeRole({ id: 99, ...(body as object) }),
  }));

  await page.goto('/roles/create');
  await expect(
    page.getByRole('checkbox', { name: 'Select all user' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Save' }).click();

  // name and code are required
  await expect(page.getByText('This field is required')).toHaveCount(2);
  expect(api.calls('POST', '/roles')).toHaveLength(0);

  await page.getByRole('textbox', { name: 'Name' }).fill('Support');
  await page.getByRole('textbox', { name: 'Code' }).fill('SUPPORT');
  await toggle(page, 'switch', 'Can access CMS');
  await toggle(page, 'checkbox', 'Select all user');
  await toggle(page, 'checkbox', 'read role');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Role created successfully')).toBeVisible();
  await expect(page).toHaveURL('/roles');
  const [post] = api.calls('POST', '/roles');
  const body = post.body as { permissionIds: number[] };
  expect(body).toMatchObject({
    name: 'Support',
    code: 'SUPPORT',
    canAccessCms: true,
  });
  // A fully selected subject is sent as its manage permission
  expect(body.permissionIds.toSorted()).toEqual(
    [permissionId('manage', 'user'), permissionId('read', 'role')].toSorted(),
  );
});

test('edits a role with its permissions pre-checked', async ({ page, api }) => {
  api.on('PATCH', '/roles/:id', ({ body }) => ({
    body: { ...EDITOR, ...(body as object) },
  }));

  await page.goto(`/roles/${EDITOR.id}/edit`);

  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(
    'Editor',
  );
  await expect(
    page.getByRole('checkbox', { name: 'Select all user' }),
  ).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'read role' })).toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: 'delete role' }),
  ).not.toBeChecked();

  await toggle(page, 'checkbox', 'delete user');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Role updated successfully')).toBeVisible();
  await expect(page).toHaveURL('/roles');
  const [patch] = api.calls('PATCH', '/roles/:id');
  expect(patch.path).toBe(`/roles/${EDITOR.id}`);
  const body = patch.body as { permissionIds: number[] };
  expect(body).toMatchObject({
    name: 'Editor',
    code: 'EDITOR',
    status: 'ACTIVE',
  });
  // manage user expands into its actions once one is removed
  expect(body.permissionIds.toSorted()).toEqual(
    [
      permissionId('create', 'user'),
      permissionId('read', 'user'),
      permissionId('update', 'user'),
      permissionId('read', 'role'),
    ].toSorted(),
  );
});

test('a system role cannot be edited or deleted', async ({ page }) => {
  await page.goto('/roles');

  const row = page.getByRole('row').filter({ hasText: 'SUPER_ADMIN' });
  await expect(row).toBeVisible();
  // Desktop actions: view, edit, delete
  await expect(row.getByRole('button').nth(1)).toBeDisabled();
  await expect(row.getByRole('button').nth(2)).toBeDisabled();

  // Opening the edit URL directly falls back to the detail page
  await page.goto(`/roles/${SYSTEM_ROLE.id}/edit`);
  await expect(page).toHaveURL(`/roles/${SYSTEM_ROLE.id}`);
  await expect(page.getByRole('button', { name: 'Edit' })).toBeDisabled();
});

test('deletes a role after confirming', async ({ page, api }) => {
  api.on('DELETE', '/roles', { body: { deleted: 1 } });

  await page.goto('/roles');
  const row = page.getByRole('row').filter({ hasText: 'EDITOR' });
  await row.getByRole('button').nth(2).click();
  await expect(page.getByText('Delete role')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByText('Role deleted successfully')).toBeVisible();
  const [request] = api.calls('DELETE', '/roles');
  expect(request.body).toEqual({ ids: [EDITOR.id] });
});

test('shows the API error when creating fails', async ({ page, api }) => {
  api.on('POST', '/roles', {
    status: 409,
    body: { statusCode: 409, message: 'Role code already exists' },
  });

  await page.goto('/roles/create');
  await page.getByRole('textbox', { name: 'Name' }).fill('Dup');
  await page.getByRole('textbox', { name: 'Code' }).fill('EDITOR');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Failed to create role')).toBeVisible();
  await expect(page.getByText('Role code already exists')).toBeVisible();
  await expect(page).toHaveURL('/roles/create');
});
