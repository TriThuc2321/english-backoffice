import type { AssessmentFormValues } from '@/schemas/assessment';
import type { GradingExpectedEntry } from '@/types/grading';

// Must match english-service/src/shared/scoring/ielts-band.ts; the server's band is authoritative
export const roundBand = (value: number) => Math.floor(value * 2 + 0.5) / 2;

export const criteriaBand = (scores: number[]) =>
  roundBand(scores.reduce((sum, s) => sum + s, 0) / scores.length);

export const writingBand = (task1: number, task2: number) =>
  roundBand((task1 + 2 * task2) / 3);

export const previewBands = (
  expected: GradingExpectedEntry[],
  values: AssessmentFormValues,
) => {
  const entries = expected.map((e, i) => {
    const criteria = values.entries[i]?.criteria ?? {};
    const scores = e.criteria.map((code) => criteria[code]);
    return scores.every((s): s is number => typeof s === 'number')
      ? criteriaBand(scores)
      : null;
  });

  const bandOfTask = (task: 1 | 2) =>
    entries[expected.findIndex((e) => e.task === task)] ?? null;
  const isWriting = expected.some((e) => e.task !== null);
  const [t1, t2] = [bandOfTask(1), bandOfTask(2)];
  const section = isWriting
    ? t1 !== null && t2 !== null
      ? writingBand(t1, t2)
      : null
    : (entries[0] ?? null);

  return { entries, section };
};
