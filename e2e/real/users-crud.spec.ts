import { request as playwrightRequest } from '@playwright/test';

import type { GetUsersResponse } from '../../src/types/user';

import {
  E2E_API_URL,
  expect,
  hasCredentials,
  login,
  test,
} from '../fixtures/real';

const email = `e2e+${Date.now()}@example.com`;

// Delete through the API with its own session, so cleanup runs even when the UI steps fail
test.afterEach(async () => {
  if (!hasCredentials) return;
  const api = await playwrightRequest.newContext({ ignoreHTTPSErrors: true });
  try {
    const token = await login(api);
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get(`${E2E_API_URL}/api/users`, {
      headers,
      params: { search: email, take: 10 },
    });
    const { data = [] } = (await response.json()) as GetUsersResponse;
    const ids = data.filter((user) => user.email === email).map(({ id }) => id);
    if (ids.length) {
      const deleted = await api.delete(`${E2E_API_URL}/api/users`, {
        headers,
        data: { ids },
      });
      expect(deleted.ok(), await deleted.text()).toBe(true);
    }
  } finally {
    await api.dispose();
  }
});

test('creates and edits a user', async ({ page }) => {
  await page.goto('/users/create');

  await page.getByRole('textbox', { name: 'First Name' }).fill('E2E');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Created');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('button', { name: /Role/ }).click();
  await page.getByRole('option').first().click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('User created successfully')).toBeVisible();
  await expect(page).toHaveURL(/\/users\/[^/]+$/);
  await expect(page.getByText(email)).toBeVisible();

  await page.goto(`${new URL(page.url()).pathname}/edit`);
  const lastName = page.getByRole('textbox', { name: 'Last Name' });
  await expect(lastName).toHaveValue('Created');
  await lastName.fill('Edited');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('User updated successfully')).toBeVisible();
  await expect(page.getByText('E2E Edited')).toBeVisible();
});
