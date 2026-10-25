import type { Passage } from '../../src/types/passage';

import { deleteBySearch, expect, test } from '../fixtures/real';

const title = `E2E passage ${Date.now()}`;

test.afterEach(() =>
  deleteBySearch<Passage>(
    'passages',
    title,
    (passage) => passage.title?.startsWith(title) ?? false,
  ),
);

test('creates, edits and publishes a passage', async ({ page }) => {
  await page.goto('/passages/create');

  await page.getByRole('textbox', { name: 'Title', exact: true }).fill(title);
  await page.getByRole('button', { name: /Marked By/ }).click();
  await page.getByRole('option', { name: 'Number' }).click();
  await page.getByRole('button', { name: 'Add Paragraph' }).click();
  await page.getByRole('button', { name: 'Add Paragraph' }).click();
  await page.locator('textarea').nth(0).fill('First E2E paragraph');
  await page.locator('textarea').nth(1).fill('Second E2E paragraph');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Passage created successfully')).toBeVisible();
  await expect(page).toHaveURL(/\/passages\/[^/]+$/);
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByText('2. Second E2E paragraph')).toBeVisible();

  await page.getByRole('button', { name: 'Edit' }).click();
  const titleInput = page.getByRole('textbox', { name: 'Title', exact: true });
  await expect(titleInput).toHaveValue(title);
  await titleInput.fill(`${title} edited`);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Passage updated successfully')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: `${title} edited` }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Publish' }).click();

  await expect(page.getByRole('button', { name: 'Unpublish' })).toBeVisible();
  await expect(page.getByText('PUBLISHED')).toBeVisible();
});
