import { describe, expect, it } from 'vitest';

import type { Question, QuestionGroup } from '@/types/test';

import { MarkedBy } from '@/types/common';
import { QuestionType } from '@/types/test';

import { toSample } from './fromGroup';
import { gradeSample } from './grading';

const question = (overrides: Partial<Question>): Question => ({
  id: 1,
  groupId: 1,
  numberFrom: 1,
  numberTo: 1,
  order: 0,
  prompt: null,
  content: null,
  answer: {},
  explanation: null,
  evidence: null,
  audioMediaId: null,
  imageMediaId: null,
  audioStartMs: null,
  ...overrides,
});

const group = (overrides: Partial<QuestionGroup>): QuestionGroup => ({
  id: 7,
  partId: 1,
  order: 0,
  questionType: QuestionType.MULTIPLE_CHOICE,
  instruction: null,
  wordLimit: null,
  content: null,
  audioMediaId: null,
  imageMediaId: null,
  groupPassages: [],
  numberFrom: null,
  numberTo: null,
  ...overrides,
});

describe('toSample', () => {
  it('maps an MCQ group in question order and grades stored keys', () => {
    const options = [
      { key: 'A', text: 'one' },
      { key: 'B', text: 'two' },
    ];
    const sample = toSample(
      group({
        instruction: 'Choose A or B.',
        audioMediaId: 3,
        questions: [
          question({
            id: 2,
            numberFrom: 2,
            numberTo: 2,
            order: 1,
            content: { options },
            answer: { key: 'A' },
          }),
          question({
            id: 1,
            numberFrom: 1,
            numberTo: 1,
            order: 0,
            content: { options },
            answer: { key: 'B' },
          }),
        ],
      }),
    );

    expect(sample.id).toBe('group-7');
    expect(sample.view).toBe('mcq');
    expect(sample.audioMediaId).toBe(3);
    expect(sample.questions.map((q) => q.n)).toEqual([1, 2]);
    expect(gradeSample(sample, { 1: 'B', 2: 'B' }).score).toBe(1);
  });

  it('keeps the template and picks the variant for form completion', () => {
    const sample = toSample(
      group({
        questionType: QuestionType.FORM_COMPLETION,
        wordLimit: 2,
        content: { template: 'Name: {{1}}' },
        questions: [question({ answer: { accepted: ['Sarah'] } })],
      }),
    );

    expect(sample.view).toBe('template');
    expect(sample.variant).toBe('form');
    expect(sample.group.content?.template).toBe('Name: {{1}}');
    expect(sample.group.wordLimit).toBe(2);
  });

  it('labels passage paragraphs for matching groups', () => {
    const sample = toSample(
      group({
        questionType: QuestionType.MATCHING_INFORMATION,
        content: { options: [{ key: 'A' }, { key: 'B' }] },
      }),
      {
        id: '1',
        title: 'Farming',
        markedBy: MarkedBy.ALPHABET,
        paragraphs: [{ content: 'First' }, { content: 'Second' }],
      },
    );

    expect(sample.view).toBe('matching');
    expect(sample.passage).toEqual({
      title: 'Farming',
      paragraphs: [
        ['A', 'First'],
        ['B', 'Second'],
      ],
    });
  });

  it('turns a text completion passage into gap text', () => {
    const sample = toSample(
      group({ questionType: QuestionType.TEXT_COMPLETION }),
      { id: '1', title: 'Memo', paragraphs: [{ content: 'Lot is {{131}}.' }] },
    );

    expect(sample.passage).toBeUndefined();
    expect(sample.passageText).toBe('Lot is [[131]].');
  });
});
