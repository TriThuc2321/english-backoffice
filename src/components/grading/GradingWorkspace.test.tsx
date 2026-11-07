import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { RolePermission } from '@/types/role';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';
import {
  ASSESSMENT_ERROR,
  GradingStatus,
  type GradingSection,
} from '@/types/grading';
import { ExamType, QuestionType, SkillType } from '@/types/test';

import GradingWorkspace from './GradingWorkspace';

const T1 = ['TA', 'CC', 'LR', 'GRA'];
const T2 = ['TR', 'CC', 'LR', 'GRA'];
const LABEL: Record<string, string> = {
  TA: 'Task Achievement',
  TR: 'Task Response',
  CC: 'Coherence & Cohesion',
  LR: 'Lexical Resource',
  GRA: 'Grammatical Range & Accuracy',
};
const FULL: RolePermission[] = [{ action: 'manage', subject: 'all' }];
const LAN = {
  id: 'g2',
  email: 'lan@x.com',
  firstName: 'Lan',
  lastName: 'Pham',
};

const question = (partId: number, type: QuestionType, text: string | null) => ({
  questionId: partId * 10,
  numberFrom: partId === 12 ? 1 : 2,
  questionType: type,
  instruction: null,
  prompt: `Prompt ${partId}`,
  content: null,
  imageUrl: null,
  audioUrl: null,
  sample: `Sample ${partId}`,
  rubric: null,
  response: text === null ? null : { text, wordCount: 3, audioUrl: null },
});

const SECTION: GradingSection = {
  attemptSectionId: 's1',
  attemptId: 'a1',
  student: { id: 'st', email: 'an@x.com', firstName: 'An', lastName: 'Nguyen' },
  test: { id: 7, title: 'IELTS Mock 1', examType: ExamType.IELTS_ACADEMIC },
  skill: SkillType.WRITING,
  submittedAt: '2026-11-05T10:00:00.000Z',
  gradingStatus: GradingStatus.PENDING,
  revision: 0,
  assessment: null,
  expectedEntries: [
    { partId: 12, task: 1, criteria: T1 },
    { partId: 13, task: 2, criteria: T2 },
  ],
  parts: [
    {
      partId: 12,
      order: 1,
      title: 'Task 1',
      instruction: null,
      questions: [
        question(12, QuestionType.IELTS_WRITING_TASK_1, 'Chart essay'),
      ],
    },
    {
      partId: 13,
      order: 2,
      title: 'Task 2',
      instruction: null,
      questions: [question(13, QuestionType.IELTS_WRITING_TASK_2, 'My essay')],
    },
  ],
};

const GRADED_BY_LAN: GradingSection = {
  ...SECTION,
  gradingStatus: GradingStatus.GRADED,
  revision: 1,
  assessment: {
    id: 'as1',
    revision: 1,
    band: 7,
    grader: LAN,
    createdAt: '2026-11-06T10:00:00.000Z',
    entries: [
      {
        partId: 12,
        criteria: { TA: 7, CC: 7, LR: 7, GRA: 7 },
        band: 7,
        feedback: null,
      },
      {
        partId: 13,
        criteria: { TR: 7, CC: 7, LR: 7, GRA: 7 },
        band: 7,
        feedback: null,
      },
    ],
  },
};

type Setup = {
  sections?: GradingSection[];
  post?: (body: unknown) => Response;
  permissions?: RolePermission[];
};

// Serves `sections` in order on each GET (the last one repeats) and records POST bodies
const renderWorkspace = ({
  sections = [SECTION],
  post = () => HttpResponse.json({ id: 'new', revision: 1 }, { status: 201 }),
  permissions = FULL,
}: Setup = {}) => {
  const posts: unknown[] = [];
  let gets = 0;
  server.use(
    http.get(`${API_URL}/grading/sections/:id`, () => {
      const section = sections[Math.min(gets, sections.length - 1)];
      gets += 1;
      return HttpResponse.json(section);
    }),
    http.get(`${API_URL}/grading/sections/:id/assessments`, () =>
      HttpResponse.json([]),
    ),
    http.post(
      `${API_URL}/grading/sections/:id/assessments`,
      async ({ request }) => {
        const body = await request.json();
        posts.push(body);
        return post(body);
      },
    ),
  );
  const router = createMemoryRouter(
    [{ path: '/grading/:id', element: <GradingWorkspace id="s1" /> }],
    { initialEntries: ['/grading/s1'] },
  );
  renderWithProviders(<RouterProvider router={router} />, { permissions });
  return { posts, getCount: () => gets };
};

const user = userEvent.setup();

const pick = async (group: HTMLElement, label: string, value: number) => {
  await user.click(
    within(group).getByRole('button', { name: new RegExp(label) }),
  );
  await user.click(await screen.findByRole('option', { name: String(value) }));
};

const fillTask = async (task: 'Task 1' | 'Task 2', score: number) => {
  const group = screen.getByRole('group', { name: task });
  for (const code of task === 'Task 1' ? T1 : T2) {
    await pick(group, LABEL[code], score);
  }
};

describe('<GradingWorkspace>', () => {
  it('shows one block per writing task with its criteria', async () => {
    renderWorkspace();

    const task1 = await screen.findByRole('group', { name: 'Task 1' });
    const task2 = screen.getByRole('group', { name: 'Task 2' });
    for (const code of T1) {
      expect(
        within(task1).getByRole('button', { name: new RegExp(LABEL[code]) }),
      ).toBeInTheDocument();
    }
    expect(
      within(task2).getByRole('button', { name: /Task Response/ }),
    ).toBeInTheDocument();
    expect(
      within(task2).queryByRole('button', { name: /Task Achievement/ }),
    ).toBeNull();
    expect(screen.getByText('My essay')).toBeInTheDocument();
  });

  it('updates the estimated band as criteria are picked', async () => {
    renderWorkspace();
    await screen.findByRole('group', { name: 'Task 1' });

    await fillTask('Task 1', 6);
    await fillTask('Task 2', 7);

    expect(
      screen.getByRole('status', { name: 'Estimated band' }),
    ).toHaveTextContent('6.5');
  });

  it('blocks submit until every criterion is set', async () => {
    const { posts } = renderWorkspace();
    await screen.findByRole('group', { name: 'Task 1' });

    await fillTask('Task 1', 6);
    await user.click(screen.getByRole('button', { name: 'Save grade' }));

    expect(await screen.findAllByText('Choose a band')).toHaveLength(4);
    expect(posts).toHaveLength(0);
  });

  it('posts expectedRevision from the section and the entries', async () => {
    const { posts } = renderWorkspace();
    await screen.findByRole('group', { name: 'Task 1' });

    await fillTask('Task 1', 6);
    await fillTask('Task 2', 7);
    await user.type(
      within(screen.getByRole('group', { name: 'Task 2' })).getByRole(
        'textbox',
        { name: /Feedback/ },
      ),
      'Clear position',
    );
    await user.click(screen.getByRole('button', { name: 'Save grade' }));

    await waitFor(() => expect(posts).toHaveLength(1));
    expect(posts[0]).toEqual({
      expectedRevision: 0,
      entries: [
        { partId: 12, criteria: { TA: 6, CC: 6, LR: 6, GRA: 6 } },
        {
          partId: 13,
          criteria: { TR: 7, CC: 7, LR: 7, GRA: 7 },
          feedback: 'Clear position',
        },
      ],
    });
  });

  it('keeps the input and shows the newer grade on a revision conflict', async () => {
    let calls = 0;
    const { posts } = renderWorkspace({
      sections: [SECTION, GRADED_BY_LAN],
      post: () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json(
              {
                statusCode: 409,
                code: ASSESSMENT_ERROR.REVISION_CONFLICT,
                message: 'Stale',
              },
              { status: 409 },
            )
          : HttpResponse.json({ id: 'as2', revision: 2 }, { status: 201 });
      },
    });
    await screen.findByRole('group', { name: 'Task 1' });

    await fillTask('Task 1', 6);
    await fillTask('Task 2', 6);
    await user.click(screen.getByRole('button', { name: 'Save grade' }));

    expect(
      await screen.findByText(/Lan Pham saved band 7/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: 'Estimated band' }),
    ).toHaveTextContent('6');
    await user.click(screen.getByRole('button', { name: 'Save correction' }));

    await waitFor(() => expect(posts).toHaveLength(2));
    expect(posts[1]).toMatchObject({
      expectedRevision: 1,
      entries: [
        { partId: 12, criteria: { TA: 6, CC: 6, LR: 6, GRA: 6 } },
        { partId: 13, criteria: { TR: 6, CC: 6, LR: 6, GRA: 6 } },
      ],
    });
  });

  it('is read-only without the create permission', async () => {
    renderWorkspace({
      sections: [GRADED_BY_LAN],
      permissions: [{ action: 'read', subject: 'assessment' }],
    });

    await screen.findByRole('group', { name: 'Task 1' });
    expect(screen.queryByRole('button', { name: /Save/ })).toBeNull();
    expect(
      screen.getByText('You can view this grade but not change it.'),
    ).toBeInTheDocument();
  });

  it('shows no response but still requires the blank task', async () => {
    const blankTask1: GradingSection = {
      ...SECTION,
      parts: [
        {
          ...SECTION.parts[0],
          questions: [question(12, QuestionType.IELTS_WRITING_TASK_1, null)],
        },
        SECTION.parts[1],
      ],
    };
    const { posts } = renderWorkspace({ sections: [blankTask1] });
    await screen.findByRole('group', { name: 'Task 1' });

    expect(screen.getByText('No response')).toBeInTheDocument();
    await fillTask('Task 2', 7);
    await user.click(screen.getByRole('button', { name: 'Save grade' }));

    expect(await screen.findAllByText('Choose a band')).toHaveLength(4);
    expect(posts).toHaveLength(0);
  });
});
