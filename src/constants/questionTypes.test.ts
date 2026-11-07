import { describe, expect, it } from 'vitest';

import { ExamType, QuestionType, SkillType } from '@/types/test';

import {
  extractPlaceholders,
  getKeyOptions,
  getTypesForSkill,
  QUESTION_TYPES,
  resolveAnswerKind,
} from './questionTypes';

const opts = (...keys: string[]) => keys.map((key) => ({ key }));

describe('extractPlaceholders', () => {
  it('returns the placeholder numbers in order', () => {
    expect(extractPlaceholders('Name: {{1}}, age {{12}} and {{3}}')).toEqual([
      1, 12, 3,
    ]);
  });

  it('ignores malformed placeholders', () => {
    expect(extractPlaceholders('{{a}} {1} {{ 2 }}')).toEqual([]);
  });
});

describe('resolveAnswerKind', () => {
  const summary = QUESTION_TYPES[QuestionType.SUMMARY_COMPLETION];

  it('uses keys for a summary with a word bank', () => {
    expect(resolveAnswerKind(summary, { options: opts('A') })).toBe('key');
  });

  it('uses accepted answers for a summary without a word bank', () => {
    expect(resolveAnswerKind(summary, { options: [] })).toBe('accepted');
  });

  it('keeps the spec answer for other types', () => {
    expect(
      resolveAnswerKind(QUESTION_TYPES[QuestionType.MULTIPLE_CHOICE_MULTI], {
        options: [],
      }),
    ).toBe('keys');
  });
});

describe('getKeyOptions', () => {
  it('returns fixed keys first', () => {
    expect(
      getKeyOptions(
        QUESTION_TYPES[QuestionType.TRUE_FALSE_NOT_GIVEN],
        { options: opts('X') },
        { options: opts('Y') },
      ),
    ).toEqual(['TRUE', 'FALSE', 'NOT GIVEN']);
  });

  it('uses trimmed, non-empty question options for multiple choice', () => {
    expect(
      getKeyOptions(
        QUESTION_TYPES[QuestionType.MULTIPLE_CHOICE],
        { options: opts('Z') },
        { options: opts(' A ', '', 'B') },
      ),
    ).toEqual(['A', 'B']);
  });

  it('uses group options for matching types', () => {
    expect(
      getKeyOptions(
        QUESTION_TYPES[QuestionType.MATCHING_HEADINGS],
        { options: opts('i', 'ii') },
        { options: [] },
      ),
    ).toEqual(['i', 'ii']);
  });

  it('returns nothing for free-text types', () => {
    expect(
      getKeyOptions(
        QUESTION_TYPES[QuestionType.SHORT_ANSWER],
        { options: opts('A') },
        { options: opts('B') },
      ),
    ).toEqual([]);
  });
});

describe('getTypesForSkill', () => {
  it('lists only the types supporting the skill', () => {
    const speaking = getTypesForSkill(SkillType.SPEAKING);

    expect(speaking).toContain(QuestionType.READ_ALOUD);
    expect(speaking).not.toContain(QuestionType.MULTIPLE_CHOICE);
  });
});

describe('getTypesForSkill with an exam type', () => {
  it('offers IELTS writing tasks only to IELTS tests', () => {
    expect(
      getTypesForSkill(SkillType.WRITING, ExamType.IELTS_ACADEMIC),
    ).toEqual(
      expect.arrayContaining([
        QuestionType.IELTS_WRITING_TASK_1,
        QuestionType.IELTS_WRITING_TASK_2,
      ]),
    );
    expect(
      getTypesForSkill(SkillType.WRITING, ExamType.TOEIC_SW),
    ).not.toContain(QuestionType.IELTS_WRITING_TASK_1);
  });

  it('offers the three IELTS speaking parts to IELTS General', () => {
    expect(
      getTypesForSkill(SkillType.SPEAKING, ExamType.IELTS_GENERAL),
    ).toEqual(
      expect.arrayContaining([
        QuestionType.IELTS_SPEAKING_PART_1,
        QuestionType.IELTS_SPEAKING_PART_2,
        QuestionType.IELTS_SPEAKING_PART_3,
      ]),
    );
  });
});
