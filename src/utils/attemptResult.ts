import type {
  AttemptAssessment,
  AttemptContent,
  AttemptListItem,
  AttemptResponse,
  AttemptResult,
  AttemptResultQuestion,
  AttemptSection,
  ContentOption,
  ContentPart,
  ContentPassage,
  ContentQuestion,
  ContentQuestionGroup,
} from '@/types/attempt';
import type { Nullable } from '@/types/common';

import { AttemptMode } from '@/types/attempt';
import { MarkedBy } from '@/types/common';
import { GradingStatus } from '@/types/grading';
import { ExamType, QuestionType, SkillType } from '@/types/test';
import { roundBand } from '@/utils/ieltsBand';

export type NumberStatus =
  | 'correct'
  | 'incorrect'
  | 'blank'
  | 'pending'
  | 'graded';

export type AnswerPart = { key: Nullable<string>; text: Nullable<string> };

export type ReviewItem = {
  // Question numbers can repeat within a section (each Writing task starts at 1)
  key: string;
  questionId: number;
  n: number;
  from: number;
  to: number;
  questionType: Nullable<QuestionType>;
  prompt: Nullable<string>;
  status: NumberStatus;
  studentAnswer: AnswerPart[];
  // null for answers graded by a teacher
  correctAnswer: Nullable<AnswerPart[]>;
  alsoAccepted: string[];
  explanation: Nullable<string>;
  evidence: Nullable<{ quote: Nullable<string>; paragraph: Nullable<string> }>;
  audioUrl: Nullable<string>;
  sample: Nullable<string>;
  flagged: boolean;
};

export type AssessmentEntryView = {
  partId: Nullable<number>;
  partTitle: Nullable<string>;
  partOrder: Nullable<number>;
  band: number;
  criteria: { code: string; band: number }[];
  feedback: Nullable<string>;
};

export type SectionAssessment = {
  band: number;
  entries: AssessmentEntryView[];
};

export type Breakdown = {
  id: string;
  label: { partTitle: Nullable<string>; partOrder: number } | QuestionType;
  correct: number;
  total: number;
  pct: number;
  weak: boolean;
};

export type StatusCounts = Record<NumberStatus, number>;

export type SectionTranscript = {
  mediaId: number;
  partTitle: Nullable<string>;
  partOrder: number;
  transcript: string;
};

export type SectionResult = {
  attemptSectionId: string;
  sectionId: number;
  skill: SkillType;
  items: ReviewItem[];
  counts: StatusCounts;
  byPart: Breakdown[];
  byType: Breakdown[];
  transcripts: SectionTranscript[];
  gradingStatus: Nullable<GradingStatus>;
  assessment: Nullable<SectionAssessment>;
};

export type SkillScore = {
  sectionId: number;
  skill: SkillType;
  scaledScore: Nullable<number>;
  rawScore: Nullable<number>;
  maxScore: Nullable<number>;
  pending: boolean;
};

export type TotalScore =
  | { kind: 'toeic'; score: number; max: number; parts: SkillScore[] }
  | { kind: 'ielts'; band: number; max: number; estimate: boolean };

export type ResultView = {
  examType: ExamType;
  skills: SkillScore[];
  total: Nullable<TotalScore>;
  sections: SectionResult[];
};

export const CRITERIA_ORDER = ['TA', 'TR', 'FC', 'CC', 'LR', 'GRA', 'P'];

export const WEAK_THRESHOLD = 60;

export const isIelts = (examType: ExamType) =>
  examType === ExamType.IELTS_ACADEMIC || examType === ExamType.IELTS_GENERAL;

type QuestionContext = {
  question: ContentQuestion;
  group: ContentQuestionGroup;
  part: ContentPart;
};

const byOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

function indexQuestions(content: Nullable<AttemptContent>) {
  const index = new Map<number, QuestionContext>();
  for (const section of content?.testSections ?? []) {
    for (const part of section.testParts) {
      for (const group of part.questionGroups) {
        for (const question of group.questions) {
          index.set(question.id, { question, group, part });
        }
      }
    }
  }
  return index;
}

const isSample = (q: AttemptResultQuestion) => 'sample' in q.answer;

const optionsOf = (ctx: QuestionContext | undefined): ContentOption[] =>
  ctx?.question.content?.options ?? ctx?.group.content?.options ?? [];

const choice = (key: string, options: ContentOption[]): AnswerPart => ({
  key,
  text: options.find((o) => o.key === key)?.text ?? null,
});

function responseParts(
  response: Nullable<AttemptResponse>,
  options: ContentOption[],
): AnswerPart[] {
  if (!response) return [];
  if ('key' in response) {
    return response.key.trim() ? [choice(response.key, options)] : [];
  }
  if ('keys' in response) return response.keys.map((k) => choice(k, options));
  if ('mediaId' in response) return [];
  return response.text.trim() ? [{ key: null, text: response.text }] : [];
}

function correctParts(
  q: AttemptResultQuestion,
  options: ContentOption[],
): { parts: Nullable<AnswerPart[]>; alsoAccepted: string[] } {
  const { answer } = q;
  if ('key' in answer) {
    return { parts: [choice(answer.key, options)], alsoAccepted: [] };
  }
  if ('keys' in answer) {
    return {
      parts: answer.keys.map((k) => choice(k, options)),
      alsoAccepted: [],
    };
  }
  if ('accepted' in answer) {
    const [first, ...rest] = answer.accepted;
    return {
      parts: first === undefined ? [] : [{ key: null, text: first }],
      alsoAccepted: rest,
    };
  }
  return { parts: null, alsoAccepted: [] };
}

function numberStatus(
  q: AttemptResultQuestion,
  n: number,
  gradingStatus: Nullable<GradingStatus>,
): NumberStatus {
  const given = q.response;
  if (isSample(q)) {
    if (!given) return 'blank';
    return gradingStatus === GradingStatus.GRADED ? 'graded' : 'pending';
  }
  if (!given) return 'blank';
  if ('keys' in given) {
    // A multi-answer question scores one point per right key; the points fill its numbers in order
    const index = n - q.numberFrom;
    if (index < q.score) return 'correct';
    return index < given.keys.length ? 'incorrect' : 'blank';
  }
  if (q.isCorrect === null) return 'blank';
  return q.isCorrect ? 'correct' : 'incorrect';
}

function paragraphLabel(
  passage: Nullable<ContentPassage> | undefined,
  paragraphId: number | undefined,
): Nullable<string> {
  if (!passage || paragraphId === undefined) return null;
  const index = byOrder(passage.paragraphs).findIndex(
    (p) => p.id === paragraphId,
  );
  if (index === -1) return null;
  if (passage.markedBy === MarkedBy.ALPHABET) {
    return String.fromCharCode(65 + index);
  }
  if (passage.markedBy === MarkedBy.NUMBER) return String(index + 1);
  return null;
}

function evidenceOf(
  q: AttemptResultQuestion,
  ctx: QuestionContext | undefined,
): ReviewItem['evidence'] {
  if (!q.evidence) return null;
  const { quote, paragraphId } = q.evidence;
  const passages = ctx ? [ctx.part.passage, ...ctx.group.passages] : [];
  const paragraph =
    passages
      .map((p) => paragraphLabel(p, paragraphId))
      .find((label) => label !== null) ?? null;
  if (!quote && !paragraph) return null;
  return { quote: quote ?? null, paragraph };
}

function breakdown(
  id: string,
  label: Breakdown['label'],
  correct: number,
  total: number,
): Breakdown {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { id, label, correct, total, pct, weak: pct < WEAK_THRESHOLD };
}

const breakdownType = (type: QuestionType): QuestionType =>
  type === QuestionType.MULTIPLE_CHOICE_MULTI
    ? QuestionType.MULTIPLE_CHOICE
    : type;

function sectionTranscripts(
  parts: ContentPart[],
  transcripts: Map<number, string>,
): SectionTranscript[] {
  const found: SectionTranscript[] = [];
  const seen = new Set<number>();
  for (const part of byOrder(parts)) {
    const media = [
      part.audio,
      ...part.questionGroups.flatMap((g) => [
        g.audio,
        ...g.questions.map((q) => q.audio),
      ]),
    ];
    for (const m of media) {
      const transcript = m && transcripts.get(m.id);
      if (!m || !transcript || seen.has(m.id)) continue;
      seen.add(m.id);
      found.push({
        mediaId: m.id,
        partTitle: part.title,
        partOrder: part.order,
        transcript,
      });
    }
  }
  return found;
}

const criteriaRank = (code: string) => {
  const i = CRITERIA_ORDER.indexOf(code);
  return i === -1 ? CRITERIA_ORDER.length : i;
};

function sectionAssessment(
  assessment: AttemptAssessment | undefined,
  parts: ContentPart[],
): Nullable<SectionAssessment> {
  if (!assessment) return null;
  return {
    band: assessment.band,
    entries: assessment.entries.map((e) => {
      const part = parts.find((p) => p.id === e.partId);
      return {
        partId: e.partId,
        partTitle: part?.title ?? null,
        partOrder: part?.order ?? null,
        band: e.band,
        criteria: Object.entries(e.criteria)
          .map(([code, band]) => ({ code, band }))
          .sort((a, b) => criteriaRank(a.code) - criteriaRank(b.code)),
        feedback: e.feedback,
      };
    }),
  };
}

const sampleOf = (q: AttemptResultQuestion) =>
  'sample' in q.answer && typeof q.answer.sample === 'string'
    ? q.answer.sample
    : null;

function sectionResult(
  section: AttemptSection,
  questions: AttemptResultQuestion[],
  index: Map<number, QuestionContext>,
  transcripts: SectionTranscript[],
  assessment: Nullable<SectionAssessment>,
): SectionResult {
  const { sectionId, skill, gradingStatus } = section;
  const items: ReviewItem[] = [];
  const counts: StatusCounts = {
    correct: 0,
    incorrect: 0,
    blank: 0,
    pending: 0,
    graded: 0,
  };
  const parts = new Map<
    number,
    { order: number; title: Nullable<string>; correct: number; total: number }
  >();
  const types = new Map<QuestionType, { correct: number; total: number }>();

  for (const q of questions) {
    const ctx = index.get(q.questionId);
    const options = optionsOf(ctx);
    const studentAnswer = responseParts(q.response, options);
    const { parts: correctAnswer, alsoAccepted } = correctParts(q, options);
    const evidence = evidenceOf(q, ctx);

    for (let n = q.numberFrom; n <= q.numberTo; n++) {
      const status = numberStatus(q, n, gradingStatus);
      counts[status]++;
      items.push({
        key: `${q.questionId}-${n}`,
        questionId: q.questionId,
        n,
        from: q.numberFrom,
        to: q.numberTo,
        questionType: ctx?.group.questionType ?? null,
        prompt: ctx?.question.prompt ?? null,
        status,
        studentAnswer,
        correctAnswer,
        alsoAccepted,
        explanation: q.explanation,
        evidence,
        audioUrl: q.audioUrl,
        sample: sampleOf(q),
        flagged: q.flagged,
      });
    }

    if (isSample(q) || !ctx) continue;
    const part = parts.get(ctx.part.id) ?? {
      order: ctx.part.order,
      title: ctx.part.title,
      correct: 0,
      total: 0,
    };
    part.correct += q.score;
    part.total += q.maxScore;
    parts.set(ctx.part.id, part);

    const typeKey = breakdownType(ctx.group.questionType);
    const type = types.get(typeKey) ?? { correct: 0, total: 0 };
    type.correct += q.score;
    type.total += q.maxScore;
    types.set(typeKey, type);
  }

  return {
    attemptSectionId: section.id,
    sectionId,
    skill,
    items,
    counts,
    byPart: [...parts]
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([id, p]) =>
        breakdown(
          `part-${id}`,
          { partTitle: p.title, partOrder: p.order },
          p.correct,
          p.total,
        ),
      ),
    byType: [...types].map(([type, s]) =>
      breakdown(`type-${type}`, type, s.correct, s.total),
    ),
    transcripts,
    gradingStatus,
    assessment,
  };
}

function totalScore(
  attempt: AttemptListItem,
  skills: SkillScore[],
): Nullable<TotalScore> {
  const { overallScore } = attempt;
  if (!isIelts(attempt.test.examType)) {
    return overallScore === null
      ? null
      : { kind: 'toeic', score: overallScore, max: 990, parts: skills };
  }
  // A practice section is not a whole exam, so it gets no overall band
  if (attempt.mode !== AttemptMode.FULL) return null;
  if (overallScore !== null) {
    return { kind: 'ielts', band: overallScore, max: 9, estimate: false };
  }
  const bands = skills
    .filter(
      (s) => s.skill === SkillType.LISTENING || s.skill === SkillType.READING,
    )
    .map((s) => s.scaledScore);
  if (bands.length < 2 || bands.some((b) => b === null)) return null;
  const mean =
    (bands as number[]).reduce((sum, b) => sum + b, 0) / bands.length;
  return { kind: 'ielts', band: roundBand(mean), max: 9, estimate: true };
}

export function buildResultView(
  result: AttemptResult,
  content: Nullable<AttemptContent>,
): ResultView {
  const { attempt, questions } = result;
  const index = indexQuestions(content);
  const transcripts = new Map(
    result.transcripts.map((t) => [t.mediaId, t.transcript]),
  );
  const sections = byOrder(attempt.sections);

  const bySection = new Map<number, AttemptResultQuestion[]>();
  for (const q of questions) {
    bySection.set(q.sectionId, [...(bySection.get(q.sectionId) ?? []), q]);
  }

  const assessments = new Map(
    result.assessments.map((a) => [a.attemptSectionId, a]),
  );

  const skills: SkillScore[] = sections.map((s) => ({
    sectionId: s.sectionId,
    skill: s.skill,
    scaledScore: s.scaledScore,
    rawScore: s.rawScore,
    maxScore: s.maxScore,
    pending: s.gradingStatus === GradingStatus.PENDING,
  }));

  return {
    examType: attempt.test.examType,
    skills,
    total: totalScore(attempt, skills),
    sections: sections.map((s) => {
      const parts =
        content?.testSections.find((ts) => ts.id === s.sectionId)?.testParts ??
        [];
      return sectionResult(
        s,
        bySection.get(s.sectionId) ?? [],
        index,
        sectionTranscripts(parts, transcripts),
        sectionAssessment(assessments.get(s.id), parts),
      );
    }),
  };
}
