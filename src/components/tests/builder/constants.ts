import type { MaxWords } from '@/types/test';

import { QuestionType } from '@/types/test';

export const QUESTION_TYPES: QuestionType[] = [
  QuestionType.SINGLE_ANSWER,
  QuestionType.MULTIPLE_ANSWER,
  QuestionType.TFN_ANSWER,
  QuestionType.YNN_ANSWER,
  QuestionType.MATCHING_PARAGRAPH,
  QuestionType.NOTE_COMPLETION_WITH_HINT,
  QuestionType.NOTE_COMPLETION_NO_HINT,
  QuestionType.DIAGRAM_LABEL_COMPLETION,
];

export const MAX_WORDS_OPTIONS: MaxWords[] = [
  'ONE_WORD',
  'TWO_WORDS',
  'ONE_WORD_OR_NUMBER',
  'NO_MORE_THAN_TWO_WORDS',
  'NO_MORE_THAN_THREE_WORDS',
];

export const MAX_MCQ_OPTIONS = 6;
export const MAX_MULTIPLE_ANSWER_OPTIONS = 10;
export const MIN_MCQ_OPTIONS = 2;
