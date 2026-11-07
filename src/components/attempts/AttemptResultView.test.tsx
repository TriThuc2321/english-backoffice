import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { RolePermission } from '@/types/role';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/utils';
import {
  AttemptMode,
  AttemptSectionStatus,
  AttemptStatus,
  type AttemptResult,
} from '@/types/attempt';
import { GradingStatus } from '@/types/grading';
import { ExamType, SkillType } from '@/types/test';

import AttemptResultView from './AttemptResultView';

const FULL: RolePermission[] = [{ action: 'manage', subject: 'all' }];

const RESULT: AttemptResult = {
  student: { id: 'u1', email: 'an@x.com', firstName: 'An', lastName: 'Nguyen' },
  attempt: {
    id: 'a1',
    testId: 7,
    testSlug: 'mock',
    mode: AttemptMode.SECTION,
    status: AttemptStatus.SUBMITTED,
    startedAt: '2026-11-01T00:00:00.000Z',
    deadlineAt: null,
    submittedAt: '2026-11-01T01:00:00.000Z',
    overallScore: null,
    test: {
      id: 7,
      slug: 'mock',
      title: 'IELTS Mock 1',
      examType: ExamType.IELTS_ACADEMIC,
    },
    sections: [
      {
        id: 'as-r',
        sectionId: 2,
        skill: SkillType.READING,
        order: 1,
        status: AttemptSectionStatus.SUBMITTED,
        startedAt: null,
        deadlineAt: null,
        submittedAt: null,
        gradingStatus: GradingStatus.AUTO_GRADED,
        rawScore: 1,
        maxScore: 2,
        scaledScore: 5.5,
      },
    ],
  },
  questions: [1, 2].map((n) => ({
    questionId: n,
    sectionId: 2,
    numberFrom: n,
    numberTo: n,
    response: { text: n === 1 ? 'river' : 'hill' },
    isCorrect: n === 1,
    score: n === 1 ? 1 : 0,
    maxScore: 1,
    flagged: false,
    answer: { accepted: ['river', 'stream'] },
    explanation: n === 2 ? 'See line 4' : null,
    evidence: null,
    audioUrl: null,
  })),
  transcripts: [],
  assessments: [],
};

const renderView = () => {
  const router = createMemoryRouter(
    [{ path: '/attempts/:id', element: <AttemptResultView id="a1" /> }],
    { initialEntries: ['/attempts/a1'] },
  );
  return renderWithProviders(<RouterProvider router={router} />, {
    permissions: FULL,
  });
};

const serveResult = (body: object, status = 200) =>
  server.use(
    http.get(`${API_URL}/attempts/a1/result`, () =>
      HttpResponse.json(body, { status }),
    ),
    http.get(`${API_URL}/attempts/a1/content`, () =>
      HttpResponse.json({}, { status: 404 }),
    ),
  );

describe('AttemptResultView', () => {
  it('shows the student, the scores and lets the reviewer step through answers', async () => {
    serveResult(RESULT);
    renderView();

    expect(await screen.findByText('An Nguyen')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('1 / 2 correct')).toBeInTheDocument();
    // the student's answer and the correct answer
    expect(screen.getAllByText('river')).toHaveLength(2);
    expect(screen.getByText('Also accepted: stream')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Question 2, Wrong' }),
    );
    expect(screen.getByText('hill')).toBeInTheDocument();
    expect(screen.getByText('See line 4')).toBeInTheDocument();
  });

  it('explains that an attempt still being taken has no result', async () => {
    serveResult(
      { statusCode: 409, code: 'ATTEMPT_NOT_GRADED', message: 'x' },
      409,
    );
    renderView();

    expect(
      await screen.findByText(
        'The student is still taking this attempt; there is no result yet.',
      ),
    ).toBeInTheDocument();
  });
});
