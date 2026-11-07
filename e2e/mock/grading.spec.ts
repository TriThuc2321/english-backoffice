import { GradingStatus } from '../../src/types/grading';
import { SkillType } from '../../src/types/test';
import { expect, test } from '../fixtures/api';
import { FULL_ACCESS, GRADER, makeQueueItem, paginate } from '../fixtures/data';

const PENDING = [
  makeQueueItem(1),
  makeQueueItem(2, { skill: SkillType.SPEAKING }),
];
const GRADED = [
  makeQueueItem(3, {
    gradingStatus: GradingStatus.GRADED,
    band: 6.5,
    grader: GRADER,
  }),
];

test.describe('grading queue', () => {
  test.beforeEach(({ api }) => {
    api.loginAs(FULL_ACCESS);
    api.on('GET', '/grading/queue', (request) =>
      paginate(
        request.query.get('gradingStatus') === GradingStatus.GRADED
          ? GRADED
          : PENDING,
      )(request),
    );
  });

  test('lists pending sections and filters by status, skill and search', async ({
    page,
    api,
  }) => {
    await page.goto('/grading');
    await expect(page.getByRole('link', { name: 'Grading' })).toBeVisible();

    const lastQuery = () => api.calls('GET', '/grading/queue').at(-1)?.query;

    await expect(page.getByText('IELTS Academic Mock 1').first()).toBeVisible();
    await expect(page.getByText('An Nguyen').first()).toBeVisible();
    await expect(page.getByText('Pending').first()).toBeVisible();
    expect(lastQuery()?.get('gradingStatus')).toBe('PENDING');

    await page.getByRole('button', { name: /Status/ }).click();
    await page.getByRole('option', { name: 'Graded' }).click();
    await expect.poll(() => lastQuery()?.get('gradingStatus')).toBe('GRADED');
    await expect(page.getByText('6.5')).toBeVisible();
    await expect(page.getByText('Lan Pham')).toBeVisible();

    await page.getByRole('button', { name: /Skill/ }).click();
    await page.getByRole('option', { name: 'Speaking' }).click();
    await expect.poll(() => lastQuery()?.get('skill')).toBe('SPEAKING');

    await page.getByRole('textbox', { name: 'Search students' }).fill('an');
    await expect.poll(() => lastQuery()?.get('search')).toBe('an');
    expect(lastQuery()?.get('page')).toBe('1');
  });

  test('opens the grading screen from a row', async ({ page }) => {
    await page.goto('/grading');

    await page.getByRole('button', { name: 'Grade' }).first().click();

    await expect(page).toHaveURL(/\/grading\/section-1$/);
  });

  test('hides grading from users without the assessment permission', async ({
    page,
    api,
  }) => {
    api.loginAs([
      { action: 'read', subject: 'dashboard' },
      { action: 'read', subject: 'test' },
    ]);
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Tests' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Grading' })).toHaveCount(0);
  });
});
