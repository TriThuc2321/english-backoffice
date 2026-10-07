import type {
  EditQuestionGroupPayload,
  Question,
  QuestionContent,
  QuestionGroup,
  TestSection,
} from '@/types/test';

import { MarkedBy } from '@/types/common';
import { QuestionType } from '@/types/test';

import { MIN_MCQ_OPTIONS } from './constants';

export type Numbering = {
  startByGroupId: Record<string, number>;
  countBySectionId: Record<string, number>;
  total: number;
};

export type QuestionRange = {
  start: number;
  end: number;
  count: number;
};

const byOrder = <T extends { order?: number }>(a: T, b: T) =>
  (a.order ?? 0) - (b.order ?? 0);

export const sortSections = (sections: TestSection[]) =>
  [...sections].sort(byOrder);

export const sortGroups = (groups: QuestionGroup[]) =>
  [...groups].sort(byOrder);

export const getQuestionWeight = (
  type: QuestionType,
  question: Pick<Question, 'content'>,
): number => {
  if (type !== QuestionType.MULTIPLE_ANSWER) return 1;

  const correctOptionIds = (
    question.content as { answer?: { optionIds?: string[] } }
  )?.answer?.optionIds;
  return Array.isArray(correctOptionIds)
    ? Math.max(new Set(correctOptionIds).size, 1)
    : 1;
};

export const getQuestionRanges = (
  type: QuestionType,
  questions: Pick<Question, 'content'>[],
  startNumber: number,
): QuestionRange[] => {
  let next = startNumber;

  return questions.map((question) => {
    const count = getQuestionWeight(type, question);
    const range = { start: next, end: next + count - 1, count };
    next = range.end + 1;
    return range;
  });
};

export const getGroupQuestionCount = (group: QuestionGroup): number =>
  (group.questions as Question[]).reduce(
    (total, question) =>
      total + getQuestionWeight(group.questionType, question),
    0,
  );

export const buildNumbering = (
  sections: TestSection[],
  groupsBySection: Record<string, QuestionGroup[]>,
): Numbering => {
  const startByGroupId: Record<string, number> = {};
  const countBySectionId: Record<string, number> = {};
  let next = 1;

  for (const section of sortSections(sections)) {
    let sectionCount = 0;
    for (const group of sortGroups(groupsBySection[section.id] ?? [])) {
      startByGroupId[group.id] = next;
      const count = getGroupQuestionCount(group);
      next += count;
      sectionCount += count;
    }
    countBySectionId[section.id] = sectionCount;
  }

  return { startByGroupId, countBySectionId, total: next - 1 };
};

const mcqOptions = (count = 4) =>
  Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    label: String.fromCharCode(65 + i),
    text: '',
  }));

export const defaultContent = (
  type: QuestionType,
  seed?: Partial<QuestionContent>,
): QuestionContent => {
  switch (type) {
    case QuestionType.SINGLE_ANSWER:
      return { text: '', options: mcqOptions(), answer: { optionId: null } };
    case QuestionType.MULTIPLE_ANSWER:
      return { text: '', options: mcqOptions(), answer: { optionIds: [] } };
    case QuestionType.TFN_ANSWER:
    case QuestionType.YNN_ANSWER:
      return { statement: '', answer: { value: null } };
    case QuestionType.MATCHING_PARAGRAPH:
      return { statement: '', answer: { paragraphLabel: null } };
    case QuestionType.NOTE_COMPLETION_WITH_HINT:
      return {
        before: '',
        after: '',
        maxWords: 'ONE_WORD',
        wordBank: (seed as { wordBank?: string[] })?.wordBank ?? [],
        answer: { value: null },
      };
    case QuestionType.NOTE_COMPLETION_NO_HINT:
      return {
        before: '',
        after: '',
        maxWords: 'ONE_WORD',
        answer: { acceptedValues: [''] },
      };
    case QuestionType.DIAGRAM_LABEL_COMPLETION: {
      const diagramSeed = seed as { imageUrl?: string; layout?: string };
      return {
        imageUrl: diagramSeed?.imageUrl ?? '',
        layout: (diagramSeed?.layout as 'listed' | 'positioned') ?? 'listed',
        hint: '',
        answer: { value: '' },
      };
    }
  }
};

export const defaultQuestion = (
  type: QuestionType,
  order = 0,
  seed?: Partial<QuestionContent>,
): Question => ({
  uuid: crypto.randomUUID(),
  order,
  content: defaultContent(type, seed),
});

export const cloneGroup = (group: QuestionGroup): QuestionGroup =>
  structuredClone(group);

export const paragraphLabels = (
  markedBy: string | undefined,
  count: number,
): string[] =>
  Array.from({ length: count }, (_, i) =>
    markedBy === MarkedBy.NUMBER ? String(i + 1) : String.fromCharCode(65 + i),
  );

/** Minimal per-question completeness check driving Save enablement. */
export const isQuestionValid = (
  type: QuestionType,
  content: any,
  wordBank: string[] = [],
): boolean => {
  switch (type) {
    case QuestionType.SINGLE_ANSWER:
      return (
        !!content?.text?.trim() &&
        (content?.options?.length ?? 0) >= MIN_MCQ_OPTIONS &&
        content.options.every((o: { text?: string }) => !!o.text?.trim()) &&
        !!content?.answer?.optionId
      );
    case QuestionType.MULTIPLE_ANSWER:
      return (
        !!content?.text?.trim() &&
        (content?.options?.length ?? 0) >= MIN_MCQ_OPTIONS &&
        content.options.every((o: { text?: string }) => !!o.text?.trim()) &&
        (content?.answer?.optionIds?.length ?? 0) >= 1
      );
    case QuestionType.TFN_ANSWER:
    case QuestionType.YNN_ANSWER:
      return !!content?.statement?.trim() && !!content?.answer?.value;
    case QuestionType.MATCHING_PARAGRAPH:
      return !!content?.statement?.trim() && !!content?.answer?.paragraphLabel;
    case QuestionType.NOTE_COMPLETION_WITH_HINT:
      return (
        (!!content?.before?.trim() || !!content?.after?.trim()) &&
        !!content?.answer?.value &&
        wordBank.includes(content.answer.value)
      );
    case QuestionType.NOTE_COMPLETION_NO_HINT:
      return (
        (!!content?.before?.trim() || !!content?.after?.trim()) &&
        (content?.answer?.acceptedValues ?? []).some((v: string) => !!v?.trim())
      );
    case QuestionType.DIAGRAM_LABEL_COMPLETION:
      return (
        !!content?.imageUrl?.trim() &&
        !!content?.hint?.trim() &&
        !!content?.answer?.value?.trim()
      );
  }
};

/** Maps a draft group to the PATCH payload. Numbering is server-managed. */
export const toEditPayload = (
  group: QuestionGroup,
): EditQuestionGroupPayload => ({
  id: group.id,
  questionType: group.questionType,
  guideline: group.guideline,
  questions: [...(group.questions as Question[])]
    .sort(byOrder)
    .map((question, index) => ({
      uuid: question.uuid || crypto.randomUUID(),
      order: index,
      content: question.content as Record<string, any>,
    })),
});
