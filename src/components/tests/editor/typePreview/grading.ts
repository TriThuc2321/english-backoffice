import type { TypeSample } from './samples';

export type PreviewAnswers = Record<number, string | string[] | undefined>;

export type QuestionResult = {
  ok: boolean;
  // correct answer to show next to the student's attempt
  expected: string;
  hits?: number;
  overLimit?: boolean;
};

export type GradeResult = {
  results: Record<number, QuestionResult>;
  score: number;
  total: number;
};

// Same rules as the service grader: case, punctuation and spacing are ignored
export const normalize = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[.,!?;:"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const wordCount = (value: unknown) =>
  normalize(value).split(' ').filter(Boolean).length;

const asString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? '' : (value ?? '');

// Speaking / writing answers are samples, so they are not scored (total 0)
export const gradeSample = (
  sample: TypeSample,
  answers: PreviewAnswers,
): GradeResult => {
  const results: Record<number, QuestionResult> = {};
  let score = 0;
  let total = 0;

  for (const q of sample.questions) {
    const { key, keys, accepted } = q.answer;
    const value = answers[q.n];

    if (keys) {
      const picked = new Set(Array.isArray(value) ? value : []);
      const hits = keys.filter((k) => picked.has(k)).length;
      score += hits;
      total += keys.length;
      results[q.n] = {
        ok: hits === keys.length,
        expected: keys.join(', '),
        hits,
      };
    } else if (key) {
      const ok = asString(value) === key;
      score += Number(ok);
      total += 1;
      results[q.n] = { ok, expected: key };
    } else if (accepted) {
      const text = asString(value);
      const limit = sample.group.wordLimit;
      const overLimit = !!limit && wordCount(text) > limit;
      const ok =
        !overLimit && accepted.some((a) => normalize(a) === normalize(text));
      score += Number(ok);
      total += 1;
      results[q.n] = { ok, expected: accepted.join(' / '), overLimit };
    }
  }

  return { results, score, total };
};
