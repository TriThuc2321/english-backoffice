import { describe, expect, it } from 'vitest';

import { QuestionType } from '@/types/test';

import { gradeSample, normalize, wordCount } from './grading';
import { findSample } from './samples';

describe('normalize', () => {
  it('ignores case, punctuation and extra spaces', () => {
    expect(normalize('  Main   Entrance. ')).toBe('main entrance');
  });

  it('counts words after normalizing', () => {
    expect(wordCount('rock  wool!')).toBe(2);
    expect(wordCount('')).toBe(0);
  });
});

describe('gradeSample', () => {
  it('grades single keys', () => {
    const sample = findSample(QuestionType.MULTIPLE_CHOICE);
    const { results, score, total } = gradeSample(sample, { 1: 'B', 2: 'A' });
    expect(results[1].ok).toBe(true);
    expect(results[2]).toMatchObject({ ok: false, expected: 'C' });
    expect([score, total]).toEqual([1, 2]);
  });

  it('scores each key of a multi-answer question, ignoring order', () => {
    const sample = findSample(QuestionType.MULTIPLE_CHOICE_MULTI);
    const full = gradeSample(sample, { 3: ['D', 'A'] });
    expect([full.score, full.total, full.results[3].ok]).toEqual([2, 2, true]);

    const half = gradeSample(sample, { 3: ['A', 'B'] });
    expect([half.score, half.results[3].ok]).toEqual([1, false]);
  });

  it('matches accepted answers after normalizing', () => {
    const sample = findSample(QuestionType.NOTE_COMPLETION);
    const { results } = gradeSample(sample, { 5: 'Main Entrance.', 7: '5PM' });
    expect(results[5].ok).toBe(true);
    expect(results[7].ok).toBe(true);
    expect(results[6].ok).toBe(false);
  });

  it('rejects answers over the word limit', () => {
    const sample = findSample(QuestionType.FORM_COMPLETION);
    const { results } = gradeSample(sample, { 3: 'BS8 4RE' });
    expect(results[3]).toMatchObject({ ok: false, overLimit: true });
  });

  it('does not score sample answers', () => {
    const sample = findSample(QuestionType.OPINION_ESSAY);
    expect(gradeSample(sample, { 8: 'My essay' })).toEqual({
      results: {},
      score: 0,
      total: 0,
    });
  });
});

describe('findSample', () => {
  it('has a sample for every question type', () => {
    for (const type of Object.values(QuestionType)) {
      const sample = findSample(type);
      expect(sample.type === type || sample.also?.includes(type)).toBe(true);
    }
  });
});
