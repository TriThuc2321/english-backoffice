import { GradingStatus } from '../../src/types/grading';
import { SkillType } from '../../src/types/test';
import { expect, test } from '../fixtures/api';
import {
  FULL_ACCESS,
  GRADER,
  makeQueueItem,
  makeSpeakingSection,
  makeWritingSection,
  paginate,
} from '../fixtures/data';

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

const SPEAKING_CRITERIA = [
  'Fluency & Coherence',
  'Lexical Resource',
  'Grammatical Range & Accuracy',
  'Pronunciation',
];

test.describe('grading screen', () => {
  test.beforeEach(({ api }) => {
    api.loginAs(FULL_ACCESS);
    api.on('GET', '/grading/sections/:id/assessments', { body: [] });
  });

  test('grades a speaking section and shows the recording', async ({
    page,
    api,
  }) => {
    api.on('GET', '/grading/sections/:id', { body: makeSpeakingSection() });
    api.on('POST', '/grading/sections/:id/assessments', {
      status: 201,
      body: { id: 'as1', revision: 1 },
    });
    await page.goto('/grading/section-2');

    await expect(
      page.locator('audio[src="/e2e-audio/answer.webm"]'),
    ).toHaveCount(1);
    const speaking = page.getByRole('group', { name: 'Speaking' });
    for (const label of SPEAKING_CRITERIA) {
      await speaking
        .getByRole('radiogroup', { name: label })
        .getByRole('radio', { name: '7', exact: true })
        .check();
    }
    await expect(
      page.getByRole('status', { name: 'Estimated band' }),
    ).toHaveText(/7/);
    await page.getByRole('button', { name: 'Save grade' }).click();

    await expect(page.getByText('Grade saved')).toBeVisible();
    expect(
      api.calls('POST', '/grading/sections/:id/assessments')[0]?.body,
    ).toEqual({
      expectedRevision: 0,
      entries: [{ partId: null, criteria: { FC: 7, LR: 7, GRA: 7, P: 7 } }],
    });
  });

  test('refetches the section when a recording fails to load', async ({
    page,
    api,
  }) => {
    api.on('GET', '/grading/sections/:id', { body: makeSpeakingSection() });
    await page.goto('/grading/section-2');

    await expect
      .poll(() => api.calls('GET', '/grading/sections/:id').length)
      .toBe(2);
  });

  test('shows a not gradable error', async ({ page, api }) => {
    api.on('GET', '/grading/sections/:id', { body: makeSpeakingSection() });
    api.on('POST', '/grading/sections/:id/assessments', {
      status: 409,
      body: { statusCode: 409, code: 'SECTION_NOT_GRADABLE', message: 'No' },
    });
    await page.goto('/grading/section-2');

    const speaking = page.getByRole('group', { name: 'Speaking' });
    for (const label of SPEAKING_CRITERIA) {
      await speaking
        .getByRole('radiogroup', { name: label })
        .getByRole('radio', { name: '6', exact: true })
        .check();
    }
    await page.getByRole('button', { name: 'Save grade' }).click();

    await expect(
      page.getByText('This section can no longer be graded.'),
    ).toBeVisible();
  });

  test('shows the writing tasks and the student essays', async ({
    page,
    api,
  }) => {
    api.on('GET', '/grading/sections/:id', { body: makeWritingSection() });
    await page.goto('/grading/section-1');

    await expect(page.getByText('Opinion essay here')).toBeVisible();
    await expect(page.getByRole('group', { name: 'Task 1' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Task 2' })).toBeVisible();
  });
});
