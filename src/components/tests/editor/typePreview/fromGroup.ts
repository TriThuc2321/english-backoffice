import type { Passage as StoredPassage } from '@/types/passage';
import type { QuestionGroup } from '@/types/test';

import { QuestionType } from '@/types/test';

import { paragraphLabel } from '../group/PassagePreview';
import { byOrder } from '../utils';
import {
  findSample,
  type SampleGroupContent,
  type SampleQuestion,
  type SampleQuestionContent,
  type TypeSample,
} from './samples';

const TEMPLATE_VARIANTS: Partial<Record<QuestionType, TypeSample['variant']>> =
  {
    [QuestionType.FORM_COMPLETION]: 'form',
    [QuestionType.NOTE_COMPLETION]: 'note',
    [QuestionType.FLOW_CHART_COMPLETION]: 'flow',
  };

const nullable = <T>(value: T | null | undefined) => value ?? undefined;

export const toSamplePassage = (passage: StoredPassage) => ({
  title: passage.title ?? '',
  paragraphs: (passage.paragraphs ?? []).map((p, index): [string, string] => [
    paragraphLabel(passage.markedBy, index),
    p.content ?? '',
  ]),
});

// Stored groups already follow the sample shape; only the view hints come from the type's sample
export const toSample = (
  group: QuestionGroup,
  passage?: StoredPassage,
): TypeSample => {
  const base = findSample(group.questionType);
  const samplePassage = passage ? toSamplePassage(passage) : undefined;
  const isTextCompletion = base.view === 'textcomp';

  const questions = byOrder(group.questions ?? []).map(
    (q): SampleQuestion => ({
      n: q.numberFrom,
      nTo: q.numberTo,
      prompt: q.prompt,
      content: nullable(q.content) as SampleQuestionContent | undefined,
      answer: q.answer,
      audioMediaId: nullable(q.audioMediaId),
      imageMediaId: nullable(q.imageMediaId),
    }),
  );

  return {
    id: `group-${group.id}`,
    type: group.questionType,
    section: base.section,
    view: base.view,
    tags: [],
    desc: '',
    boxTitle: base.boxTitle,
    variant: TEMPLATE_VARIANTS[group.questionType],
    email: base.email,
    rows: base.rows,
    minWords: base.minWords,
    group: {
      instruction: group.instruction ?? '',
      wordLimit: nullable(group.wordLimit),
      content: nullable(group.content) as SampleGroupContent | undefined,
    },
    questions,
    passage: isTextCompletion ? undefined : samplePassage,
    // TextCompletionView marks gaps as [[n]]; editors may also type {{n}}
    passageText: isTextCompletion
      ? (samplePassage?.paragraphs ?? [])
          .map(([, text]) => text.replace(/\{\{(\d+)\}\}/g, '[[$1]]'))
          .join('\n\n')
      : undefined,
    audioMediaId: nullable(group.audioMediaId),
    imageMediaId: nullable(group.imageMediaId),
  };
};
