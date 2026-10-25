import { expect, test } from '../fixtures/real';

// Read-only: navigates in-app (one page load, one token refresh) and never writes.
test('dashboard and the main lists load', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  const lists = [
    { link: 'Users', url: '/users', table: 'CMS Users table' },
    { link: 'Roles', url: '/roles', table: 'Roles table' },
    { link: 'Tests', url: '/tests', table: 'Tests table' },
  ];

  for (const { link, url, table } of lists) {
    await test.step(link, async () => {
      await page.getByRole('link', { name: link, exact: true }).click();
      await expect(page).toHaveURL(url);
      const grid = page.getByRole('grid', { name: table });
      await expect(grid).toBeVisible();
      // Header row plus at least one data row (or the empty state row)
      await expect(grid.getByRole('row').nth(1)).toBeVisible();
    });
  }
});
