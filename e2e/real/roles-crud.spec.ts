import type { Role } from '../../src/types/role';

import { deleteBySearch, expect, test } from '../fixtures/real';

const code = `E2E_${Date.now()}`;

test.afterEach(() =>
  deleteBySearch<Role>('roles', code, (role) => role.code === code),
);

test('creates and edits a role', async ({ page }) => {
  await page.goto('/roles/create');

  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Role');
  await page.getByRole('textbox', { name: 'Code' }).fill(code);
  await page
    .getByRole('checkbox', { name: 'read user' })
    .locator('xpath=ancestor::label[1]')
    .click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Role created successfully')).toBeVisible();
  await expect(page).toHaveURL('/roles');

  // Navigate in-app: every reload costs a token refresh
  await page.getByRole('textbox', { name: 'Search roles' }).fill(code);
  const row = page.getByRole('row').filter({ hasText: code });
  await expect(row).toHaveCount(1);
  await row.getByRole('button').nth(1).click();

  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(
    'E2E Role',
  );
  const readUser = page.getByRole('checkbox', { name: 'read user' });
  await expect(readUser).toBeChecked();
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Role Edited');
  await page
    .getByRole('checkbox', { name: 'update user' })
    .locator('xpath=ancestor::label[1]')
    .click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Role updated successfully')).toBeVisible();
  await page.getByRole('textbox', { name: 'Search roles' }).fill(code);
  await expect(
    page.getByRole('row').filter({ hasText: 'E2E Role Edited' }),
  ).toHaveCount(1);
});
