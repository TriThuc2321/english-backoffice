import { describe, expect, it } from 'vitest';

import type { GradingExpectedEntry } from '@/types/grading';

import {
  criteriaBand,
  previewBands,
  roundBand,
  writingBand,
} from './ieltsBand';

const all = (codes: string[], score: number | null) =>
  Object.fromEntries(codes.map((code) => [code, score]));

const T1 = ['TA', 'CC', 'LR', 'GRA'];
const T2 = ['TR', 'CC', 'LR', 'GRA'];
const WRITING: GradingExpectedEntry[] = [
  { partId: 12, task: 1, criteria: T1 },
  { partId: 13, task: 2, criteria: T2 },
];

describe('roundBand', () => {
  it.each([
    [6.25, 6.5],
    [6.75, 7],
    [6.2, 6],
    [6.7, 6.5],
    [6.24, 6],
  ])('rounds %s to %s', (value, band) => {
    expect(roundBand(value)).toBe(band);
  });
});

describe('criteriaBand', () => {
  it('averages criteria', () => {
    expect(criteriaBand([7, 6.5, 7, 6])).toBe(6.5);
  });
});

describe('writingBand', () => {
  it('weights task 2 double', () => {
    expect(writingBand(6, 7)).toBe(6.5);
  });
});

describe('previewBands', () => {
  it('computes each task and the writing band', () => {
    expect(
      previewBands(WRITING, {
        entries: [
          { partId: 12, criteria: all(T1, 6), feedback: '' },
          { partId: 13, criteria: all(T2, 7), feedback: '' },
        ],
      }),
    ).toEqual({ entries: [6, 7], section: 6.5 });
  });

  it('leaves an entry and the section empty until every criterion is set', () => {
    expect(
      previewBands(WRITING, {
        entries: [
          { partId: 12, criteria: { ...all(T1, 6), GRA: null }, feedback: '' },
          { partId: 13, criteria: all(T2, 7), feedback: '' },
        ],
      }),
    ).toEqual({ entries: [null, 7], section: null });
  });

  it('uses the single speaking entry as the section band', () => {
    expect(
      previewBands(
        [{ partId: null, task: null, criteria: ['FC', 'LR', 'GRA', 'P'] }],
        {
          entries: [
            {
              partId: null,
              criteria: { FC: 7, LR: 6.5, GRA: 7, P: 6 },
              feedback: '',
            },
          ],
        },
      ),
    ).toEqual({ entries: [6.5], section: 6.5 });
  });
});
