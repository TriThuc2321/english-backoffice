import { describe, expect, it } from 'vitest';

import type { GradingSection } from '@/types/grading';

import { GradingStatus } from '@/types/grading';
import { ExamType, SkillType } from '@/types/test';

import {
  buildAssessmentSchema,
  toAssessmentFormValues,
  toCreateAssessmentPayload,
} from './assessment';

const T1 = ['TA', 'CC', 'LR', 'GRA'];
const T2 = ['TR', 'CC', 'LR', 'GRA'];
const SP = ['FC', 'LR', 'GRA', 'P'];

const user = {
  id: 'g1',
  email: 'lan@x.com',
  firstName: 'Lan',
  lastName: 'Pham',
};

const section = (over: Partial<GradingSection> = {}): GradingSection => ({
  attemptSectionId: 's1',
  attemptId: 'a1',
  student: user,
  test: { id: 1, title: 'IELTS 1', examType: ExamType.IELTS_ACADEMIC },
  skill: SkillType.WRITING,
  submittedAt: '2026-11-05T10:00:00.000Z',
  gradingStatus: GradingStatus.PENDING,
  revision: 0,
  assessment: null,
  expectedEntries: [
    { partId: 12, task: 1, criteria: T1 },
    { partId: 13, task: 2, criteria: T2 },
  ],
  parts: [],
  ...over,
});

const filled = (codes: string[], score: number) =>
  Object.fromEntries(codes.map((code) => [code, score]));

describe('toAssessmentFormValues', () => {
  it('starts empty when ungraded', () => {
    expect(toAssessmentFormValues(section())).toEqual({
      entries: [
        {
          partId: 12,
          criteria: { TA: null, CC: null, LR: null, GRA: null },
          feedback: '',
        },
        {
          partId: 13,
          criteria: { TR: null, CC: null, LR: null, GRA: null },
          feedback: '',
        },
      ],
    });
  });

  it('prefills from the current assessment', () => {
    const values = toAssessmentFormValues(
      section({
        gradingStatus: GradingStatus.GRADED,
        revision: 2,
        assessment: {
          id: 'as2',
          revision: 2,
          band: 6.5,
          grader: user,
          createdAt: '2026-11-06T10:00:00.000Z',
          entries: [
            { partId: 13, criteria: filled(T2, 7), band: 7, feedback: 'Good' },
            { partId: 12, criteria: filled(T1, 6), band: 6, feedback: null },
          ],
        },
      }),
    );

    expect(values.entries).toEqual([
      { partId: 12, criteria: filled(T1, 6), feedback: '' },
      { partId: 13, criteria: filled(T2, 7), feedback: 'Good' },
    ]);
  });
});

describe('buildAssessmentSchema', () => {
  const schema = buildAssessmentSchema(section().expectedEntries);
  const valid = {
    entries: [
      { partId: 12, criteria: filled(T1, 6), feedback: '' },
      { partId: 13, criteria: filled(T2, 7), feedback: '' },
    ],
  };

  it('accepts every criterion on the half-band grid', async () => {
    await expect(schema.validate(valid)).resolves.toBeTruthy();
  });

  it('rejects a missing criterion', async () => {
    const values = structuredClone(valid) as {
      entries: { criteria: Record<string, number | null> }[];
    };
    values.entries[0].criteria.TA = null;
    await expect(schema.validate(values)).rejects.toMatchObject({
      path: 'entries[0].criteria.TA',
    });
  });

  it('rejects a score off the half-band grid', async () => {
    const values = structuredClone(valid);
    values.entries[1].criteria.TR = 6.3;
    await expect(schema.validate(values)).rejects.toMatchObject({
      path: 'entries[1].criteria.TR',
    });
  });

  it('rejects feedback over 5000 characters', async () => {
    const values = structuredClone(valid);
    values.entries[0].feedback = 'x'.repeat(5001);
    await expect(schema.validate(values)).rejects.toMatchObject({
      path: 'entries[0].feedback',
    });
  });
});

describe('toCreateAssessmentPayload', () => {
  it('builds the payload without empty feedback', () => {
    expect(
      toCreateAssessmentPayload('s1', 2, {
        entries: [{ partId: null, criteria: filled(SP, 7), feedback: '  ' }],
      }),
    ).toEqual({
      id: 's1',
      expectedRevision: 2,
      entries: [{ partId: null, criteria: filled(SP, 7) }],
    });
  });

  it('keeps trimmed feedback', () => {
    expect(
      toCreateAssessmentPayload('s1', 0, {
        entries: [
          { partId: null, criteria: filled(SP, 7), feedback: ' Nice ' },
        ],
      }).entries[0].feedback,
    ).toBe('Nice');
  });
});
