import { QuestionType, SkillType } from '@/types/test';

// Shapes follow english-service/docs/question-formats.md
export type GroupContentKind =
  | 'none'
  | 'matching' // options with text (required)
  | 'matchingInfo' // options, text optional (paragraph letters)
  | 'template' // template with {{n}} (required)
  | 'templateOptional'
  | 'summary' // template + optional word bank
  | 'table'
  | 'labels' // options without text
  | 'info'; // TOEIC Speaking schedule

export type QuestionContentKind =
  | 'none'
  | 'options'
  | 'optionsNoText'
  | 'timing';

export type AnswerKind =
  | 'key'
  | 'keys'
  | 'accepted'
  | 'keyOrAccepted'
  | 'sample';

export type TypeSpec = {
  skills: SkillType[];
  groupContent: GroupContentKind;
  questionContent: QuestionContentKind;
  answer: AnswerKind;
  fixedKeys?: string[];
};

const { LISTENING, READING, WRITING, SPEAKING } = SkillType;
const LR = [LISTENING, READING];

export const QUESTION_TYPES: Record<QuestionType, TypeSpec> = {
  [QuestionType.MULTIPLE_CHOICE]: {
    skills: LR,
    groupContent: 'none',
    questionContent: 'options',
    answer: 'key',
  },
  [QuestionType.MULTIPLE_CHOICE_MULTI]: {
    skills: LR,
    groupContent: 'none',
    questionContent: 'options',
    answer: 'keys',
  },
  [QuestionType.TRUE_FALSE_NOT_GIVEN]: {
    skills: [READING],
    groupContent: 'none',
    questionContent: 'none',
    answer: 'key',
    fixedKeys: ['TRUE', 'FALSE', 'NOT GIVEN'],
  },
  [QuestionType.YES_NO_NOT_GIVEN]: {
    skills: [READING],
    groupContent: 'none',
    questionContent: 'none',
    answer: 'key',
    fixedKeys: ['YES', 'NO', 'NOT GIVEN'],
  },
  [QuestionType.MATCHING_HEADINGS]: {
    skills: [READING],
    groupContent: 'matching',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.MATCHING_INFORMATION]: {
    skills: [READING],
    groupContent: 'matchingInfo',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.MATCHING_FEATURES]: {
    skills: LR,
    groupContent: 'matching',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.MATCHING_SENTENCE_ENDINGS]: {
    skills: [READING],
    groupContent: 'matching',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.CLASSIFICATION]: {
    skills: LR,
    groupContent: 'matching',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.FORM_COMPLETION]: {
    skills: LR,
    groupContent: 'template',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.SENTENCE_COMPLETION]: {
    skills: LR,
    groupContent: 'templateOptional',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.SUMMARY_COMPLETION]: {
    skills: LR,
    groupContent: 'summary',
    questionContent: 'none',
    answer: 'keyOrAccepted',
  },
  [QuestionType.NOTE_COMPLETION]: {
    skills: LR,
    groupContent: 'template',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.TABLE_COMPLETION]: {
    skills: LR,
    groupContent: 'table',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.FLOW_CHART_COMPLETION]: {
    skills: LR,
    groupContent: 'template',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.DIAGRAM_LABELLING]: {
    skills: LR,
    groupContent: 'none',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.MAP_LABELLING]: {
    skills: [LISTENING],
    groupContent: 'labels',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.PLAN_LABELLING]: {
    skills: [LISTENING],
    groupContent: 'labels',
    questionContent: 'none',
    answer: 'key',
  },
  [QuestionType.SHORT_ANSWER]: {
    skills: LR,
    groupContent: 'none',
    questionContent: 'none',
    answer: 'accepted',
  },
  [QuestionType.PHOTO_DESCRIPTION]: {
    skills: [LISTENING],
    groupContent: 'none',
    questionContent: 'optionsNoText',
    answer: 'key',
  },
  [QuestionType.QUESTION_RESPONSE]: {
    skills: [LISTENING],
    groupContent: 'none',
    questionContent: 'optionsNoText',
    answer: 'key',
  },
  [QuestionType.TEXT_COMPLETION]: {
    skills: [READING],
    groupContent: 'none',
    questionContent: 'options',
    answer: 'key',
  },
  [QuestionType.READ_ALOUD]: {
    skills: [SPEAKING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.DESCRIBE_PICTURE]: {
    skills: [SPEAKING, WRITING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.RESPOND_TO_QUESTIONS]: {
    skills: [SPEAKING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.RESPOND_USING_INFO]: {
    skills: [SPEAKING],
    groupContent: 'info',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.EXPRESS_OPINION]: {
    skills: [SPEAKING, WRITING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.WRITE_SENTENCE_PICTURE]: {
    skills: [WRITING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.RESPOND_WRITTEN_REQUEST]: {
    skills: [WRITING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
  [QuestionType.OPINION_ESSAY]: {
    skills: [WRITING],
    groupContent: 'none',
    questionContent: 'timing',
    answer: 'sample',
  },
};

export const getTypesForSkill = (skill: SkillType) =>
  Object.values(QuestionType).filter((type) =>
    QUESTION_TYPES[type].skills.includes(skill),
  );

// Families whose answers are matched as free text (word limit applies)
export const usesWordLimit = (spec: TypeSpec) =>
  spec.answer === 'accepted' || spec.answer === 'keyOrAccepted';

export const usesGroupOptions = (kind: GroupContentKind) =>
  kind === 'matching' ||
  kind === 'matchingInfo' ||
  kind === 'summary' ||
  kind === 'labels';

export const usesTemplate = (kind: GroupContentKind) =>
  kind === 'template' || kind === 'templateOptional' || kind === 'summary';

export const extractPlaceholders = (text: string) =>
  [...text.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));

type OptionLike = { key: string };

// SUMMARY_COMPLETION answers with a key only when the group has a word bank
export const resolveAnswerKind = (
  spec: TypeSpec,
  content: { options: OptionLike[] },
): Exclude<AnswerKind, 'keyOrAccepted'> => {
  if (spec.answer !== 'keyOrAccepted') return spec.answer;
  return content.options.length ? 'key' : 'accepted';
};

// Where the answer keys of a question come from
export const getKeyOptions = (
  spec: TypeSpec,
  content: { options: OptionLike[] },
  question: { options: OptionLike[] },
) => {
  if (spec.fixedKeys) return spec.fixedKeys;
  if (
    spec.questionContent === 'options' ||
    spec.questionContent === 'optionsNoText'
  )
    return question.options.map((o) => o.key.trim()).filter(Boolean);
  if (usesGroupOptions(spec.groupContent))
    return content.options.map((o) => o.key.trim()).filter(Boolean);
  return [];
};
