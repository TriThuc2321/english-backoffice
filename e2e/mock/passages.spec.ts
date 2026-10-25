import { MarkedBy } from '../../src/types/common';
import { PassageStatus } from '../../src/types/passage';
import { expect, test } from '../fixtures/api';
import { FULL_ACCESS, makePassage, paginate, PASSAGES } from '../fixtures/data';

const PUBLISHED = makePassage(1, {
  status: PassageStatus.PUBLISHED,
  markedBy: MarkedBy.NUMBER,
});
const ITEMS = [PUBLISHED, ...PASSAGES.slice(1)];

test.beforeEach(({ api }) => {
  api.loginAs(FULL_ACCESS);
  api.on('GET', '/passages', paginate(ITEMS));
  api.on('GET', '/passages/:id', ({ params }) => {
    const passage = ITEMS.find(({ id }) => id === params.id);
    return passage
      ? { body: passage }
      : { status: 404, body: { message: 'Not found' } };
  });
});

test('lists passages and searches', async ({ page, api }) => {
  await page.goto('/passages');

  await expect(
    page.getByRole('rowheader', { name: 'Passage 1', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('/ 15 items')).toBeVisible();

  await page.getByRole('textbox', { name: 'Search passages' }).fill('nile');

  await expect
    .poll(() => api.calls('GET', '/passages').at(-1)?.query.get('search'))
    .toBe('nile');
  const searches = api
    .calls('GET', '/passages')
    .map((call) => call.query.get('search'))
    .filter(Boolean);
  expect(searches).toEqual(['nile']);
});

test('shows the paragraphs with their markers', async ({ page }) => {
  await page.goto(`/passages/${PUBLISHED.id}`);

  await expect(page.getByRole('heading', { name: 'Passage 1' })).toBeVisible();
  await expect(page.getByText('1. First paragraph of 1')).toBeVisible();
  await expect(page.getByText('2. Second paragraph of 1')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Unpublish' })).toBeVisible();
});

test('validates and creates a passage with paragraphs', async ({
  page,
  api,
}) => {
  const created = makePassage(99, { id: 'new-passage', title: 'The Nile' });
  api.on('POST', '/passages', { status: 201, body: created });
  api.on('GET', '/passages/:id', { body: created });

  await page.goto('/passages/create');
  const paragraphs = page.locator('textarea');

  await page.getByRole('button', { name: 'Add Paragraph' }).click();
  await page.getByRole('button', { name: 'Add Paragraph' }).click();
  await page.getByRole('button', { name: 'Add Paragraph' }).click();
  await expect(paragraphs).toHaveCount(3);
  await page.getByRole('button', { name: 'Save' }).click();

  // title and the three empty paragraphs
  await expect(page.getByText('This field is required')).toHaveCount(4);
  expect(api.calls('POST', '/passages')).toHaveLength(0);

  await page
    .getByRole('textbox', { name: 'Title', exact: true })
    .fill('The Nile');
  await page.getByRole('button', { name: /Marked By/ }).click();
  await page.getByRole('option', { name: 'Alphabet' }).click();
  await paragraphs.nth(0).fill('First');
  await paragraphs.nth(1).fill('To remove');
  await paragraphs.nth(2).fill('Third');
  // Remove the second paragraph with its trash button
  await page.locator('div.items-start').nth(1).getByRole('button').click();
  await expect(paragraphs).toHaveCount(2);
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Passage created successfully')).toBeVisible();
  await expect(page).toHaveURL(`/passages/${created.id}`);
  const [post] = api.calls('POST', '/passages');
  expect(post.body).toEqual({
    title: 'The Nile',
    subtitle: '',
    markedBy: 'ALPHABET',
    paragraphs: [{ content: 'First' }, { content: 'Third' }],
  });
});

test('edits a passage with its values pre-filled', async ({ page, api }) => {
  const passage = ITEMS[1];
  api.on('PATCH', '/passages/:id', { body: passage });

  await page.goto(`/passages/${passage.id}/edit`);

  const title = page.getByRole('textbox', { name: 'Title', exact: true });
  await expect(title).toHaveValue('Passage 2');
  await expect(page.getByRole('textbox', { name: 'Subtitle' })).toHaveValue(
    'Subtitle 2',
  );
  await expect(page.locator('textarea')).toHaveCount(2);
  await expect(page.locator('textarea').first()).toHaveValue(
    'First paragraph of 2',
  );

  await title.fill('Passage 2 edited');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Passage updated successfully')).toBeVisible();
  await expect(page).toHaveURL(`/passages/${passage.id}`);
  const [patch] = api.calls('PATCH', '/passages/:id');
  expect(patch.path).toBe(`/passages/${passage.id}`);
  expect(patch.body).toEqual({
    title: 'Passage 2 edited',
    subtitle: 'Subtitle 2',
    markedBy: 'ALPHABET',
    status: 'DRAFT',
    paragraphs: [
      { content: 'First paragraph of 2' },
      { content: 'Second paragraph of 2' },
    ],
  });
});

test('publishes from the edit form with a status-only PATCH', async ({
  page,
  api,
}) => {
  const passage = ITEMS[1];
  api.on('PATCH', '/passages/:id', ({ body }) => ({
    body: { ...passage, ...(body as object) },
  }));

  await page.goto(`/passages/${passage.id}/edit`);
  await expect(
    page.getByRole('textbox', { name: 'Title', exact: true }),
  ).toHaveValue('Passage 2');
  await page.getByRole('button', { name: 'Publish' }).click();

  await expect(page.getByRole('button', { name: 'Unpublish' })).toBeVisible();
  const [patch] = api.calls('PATCH', '/passages/:id');
  expect(patch.body).toEqual({ status: 'PUBLISHED' });
  // Publishing alone does not leave the form
  await expect(page).toHaveURL(`/passages/${passage.id}/edit`);
});

test('deletes a passage after confirming', async ({ page, api }) => {
  api.on('DELETE', '/passages', { body: { deleted: 1 } });

  await page.goto('/passages');
  const row = page.getByRole('row', { name: 'Passage 3', exact: true });
  await row.getByRole('button').nth(2).click();
  await expect(page.getByText('Delete passage')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expect(page.getByText('Passage deleted successfully')).toBeVisible();
  const [request] = api.calls('DELETE', '/passages');
  expect(request.body).toEqual({ ids: ['passage-3'] });
});
