import { describe, expect, it } from 'vitest';

import type {
  AttemptContent,
  AttemptResult,
  AttemptResultQuestion,
  AttemptSection,
} from '@/types/attempt';

import {
  AttemptMode,
  AttemptSectionStatus,
  AttemptStatus,
} from '@/types/attempt';
import { MarkedBy } from '@/types/common';
import { GradingStatus } from '@/types/grading';
import { ExamType, QuestionType, SkillType } from '@/types/test';

import { buildResultView } from './attemptResult';

const section = (
  over: Partial<AttemptSection> &
    Pick<AttemptSection, 'id' | 'sectionId' | 'skill' | 'order'>,
): AttemptSection => ({
  status: AttemptSectionStatus.SUBMITTED,
  startedAt: null,
  deadlineAt: null,
  submittedAt: null,
  gradingStatus: GradingStatus.AUTO_GRADED,
  rawScore: null,
  maxScore: null,
  scaledScore: null,
  ...over,
});

const question = (
  over: Partial<AttemptResultQuestion> &
    Pick<AttemptResultQuestion, 'questionId' | 'sectionId' | 'numberFrom'>,
): AttemptResultQuestion => ({
  numberTo: over.numberFrom,
  response: null,
  isCorrect: null,
  score: 0,
  maxScore: 1,
  flagged: false,
  answer: { key: 'A' },
  explanation: null,
  evidence: null,
  audioUrl: null,
  ...over,
});

const READING = section({
  id: 'as-r',
  sectionId: 2,
  skill: SkillType.READING,
  order: 2,
  rawScore: 3,
  maxScore: 4,
  scaledScore: 6.5,
});
const LISTENING = section({
  id: 'as-l',
  sectionId: 1,
  skill: SkillType.LISTENING,
  order: 1,
  rawScore: 1,
  maxScore: 1,
  scaledScore: 7,
});
const WRITING = section({
  id: 'as-w',
  sectionId: 3,
  skill: SkillType.WRITING,
  order: 3,
  gradingStatus: GradingStatus.GRADED,
  scaledScore: 6,
});

const passage = {
  id: 1,
  title: 'P',
  subtitle: null,
  markedBy: MarkedBy.ALPHABET,
  paragraphs: [
    { id: 11, content: 'x', order: 1 },
    { id: 12, content: 'y', order: 2 },
  ],
};

const CONTENT: AttemptContent = {
  id: 7,
  slug: 'mock',
  title: 'Mock',
  examType: ExamType.IELTS_ACADEMIC,
  testSections: [
    {
      id: 2,
      skill: SkillType.READING,
      order: 2,
      testParts: [
        {
          id: 20,
          order: 1,
          title: 'Passage 1',
          instruction: null,
          audio: null,
          passage,
          questionGroups: [
            {
              id: 200,
              order: 1,
              questionType: QuestionType.MULTIPLE_CHOICE_MULTI,
              instruction: null,
              content: {
                options: [
                  { key: 'A', text: 'Apple' },
                  { key: 'B', text: 'Banana' },
                  { key: 'C', text: 'Cherry' },
                ],
              },
              audio: null,
              image: null,
              passages: [],
              questions: [
                {
                  id: 1001,
                  numberFrom: 1,
                  numberTo: 2,
                  order: 1,
                  prompt: 'Pick two',
                  content: null,
                  audio: null,
                  image: null,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 3,
      skill: SkillType.WRITING,
      order: 3,
      testParts: [
        {
          id: 30,
          order: 1,
          title: 'Task 1',
          instruction: null,
          audio: null,
          passage: null,
          questionGroups: [],
        },
      ],
    },
  ],
};

const RESULT: AttemptResult = {
  student: { id: 'u1', email: 'an@x.com', firstName: 'An', lastName: null },
  attempt: {
    id: 'a1',
    testId: 7,
    testSlug: 'mock',
    mode: AttemptMode.FULL,
    status: AttemptStatus.SUBMITTED,
    startedAt: '2026-11-01T00:00:00.000Z',
    deadlineAt: null,
    submittedAt: null,
    overallScore: null,
    test: {
      id: 7,
      slug: 'mock',
      title: 'Mock',
      examType: ExamType.IELTS_ACADEMIC,
    },
    sections: [WRITING, READING, LISTENING],
  },
  questions: [
    question({
      questionId: 1001,
      sectionId: 2,
      numberFrom: 1,
      numberTo: 2,
      response: { keys: ['A', 'C'] },
      score: 1,
      maxScore: 2,
      answer: { keys: ['A', 'B'] },
      evidence: { paragraphId: 12, quote: 'yes' },
      flagged: true,
    }),
    question({
      questionId: 3001,
      sectionId: 3,
      numberFrom: 1,
      response: { text: 'My essay' },
      answer: { sample: 'Model essay' },
    }),
  ],
  transcripts: [],
  assessments: [
    {
      attemptSectionId: 'as-w',
      band: 6,
      entries: [
        {
          partId: 30,
          criteria: { GRA: 6, TA: 6.5, LR: 6, CC: 5.5 },
          band: 6,
          feedback: 'Good',
        },
      ],
    },
  ],
};

describe('buildResultView', () => {
  const view = buildResultView(RESULT, CONTENT);

  it('orders sections and estimates the IELTS band from Listening and Reading', () => {
    expect(view.sections.map((s) => s.skill)).toEqual([
      SkillType.LISTENING,
      SkillType.READING,
      SkillType.WRITING,
    ]);
    expect(view.total).toEqual({
      kind: 'ielts',
      band: 7,
      max: 9,
      estimate: true,
    });
  });

  it('splits a multi-answer question into one number per point', () => {
    const reading = view.sections[1];
    expect(reading.items.map((i) => [i.n, i.status])).toEqual([
      [1, 'correct'],
      [2, 'incorrect'],
    ]);
    expect(reading.items[0]).toMatchObject({
      prompt: 'Pick two',
      flagged: true,
      studentAnswer: [
        { key: 'A', text: 'Apple' },
        { key: 'C', text: 'Cherry' },
      ],
      correctAnswer: [
        { key: 'A', text: 'Apple' },
        { key: 'B', text: 'Banana' },
      ],
      evidence: { quote: 'yes', paragraph: 'B' },
    });
    expect(reading.byType).toEqual([
      expect.objectContaining({
        label: QuestionType.MULTIPLE_CHOICE,
        correct: 1,
        total: 2,
        weak: true,
      }),
    ]);
  });

  it('marks teacher-graded answers and sorts assessment criteria', () => {
    const writing = view.sections[2];
    expect(writing.items[0]).toMatchObject({
      status: 'graded',
      sample: 'Model essay',
      correctAnswer: null,
    });
    expect(writing.assessment?.entries[0]).toMatchObject({
      partTitle: 'Task 1',
      criteria: [
        { code: 'TA', band: 6.5 },
        { code: 'CC', band: 5.5 },
        { code: 'LR', band: 6 },
        { code: 'GRA', band: 6 },
      ],
    });
  });

  it('still lists answers when the test content is unavailable', () => {
    const bare = buildResultView(RESULT, null);
    expect(bare.sections[1].items[0]).toMatchObject({
      prompt: null,
      studentAnswer: [
        { key: 'A', text: null },
        { key: 'C', text: null },
      ],
    });
  });

  it('gives a practice section no overall band', () => {
    const practice = buildResultView(
      { ...RESULT, attempt: { ...RESULT.attempt, mode: AttemptMode.SECTION } },
      CONTENT,
    );
    expect(practice.total).toBeNull();
  });
});
