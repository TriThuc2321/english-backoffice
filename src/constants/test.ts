export const TEST_TYPE = {
  PRACTICE_TEST: 'practiceTest',
  FULL_TEST: 'fullTest',
} as const;
export type TestType = (typeof TEST_TYPE)[keyof typeof TEST_TYPE];

export const TEST_SKILL = {
  LISTENING: 'listening',
  READING: 'reading',
} as const;
export type TestSkill = (typeof TEST_SKILL)[keyof typeof TEST_SKILL];

export const TEST_TYPE_OPTIONS = [
  {
    label: 'practiceTest',
    value: 'practiceTest',
  },
  {
    label: 'fullTest',
    value: 'fullTest',
  },
];

export const TEST_SKILL_OPTIONS = [
  {
    label: 'listening',
    value: 'listening',
  },
  {
    label: 'reading',
    value: 'reading',
  },
];

export const QUESTION_TYPE_OPTIONS = [
  {
    label: 'Single Answer',
    value: 'SINGLE_ANSWER',
  },
  {
    label: 'Multiple Answer',
    value: 'MULTIPLE_ANSWER',
  },
  {
    label: 'Yes/No/Not Given Answer',
    value: 'YNN_ANSWER',
  },
  {
    label: 'Matching Paragraph',
    value: 'MATCHING_PARAGRAPH',
  },
  {
    label: 'Note Completion with Hint',
    value: 'NOTE_COMPLETION_WITH_HINT',
  },
  {
    label: 'Note Completion No Hint',
    value: 'NOTE_COMPLETION_NO_HINT',
  },
  {
    label: 'Diagram Label Completion',
    value: 'DIAGRAM_LABEL_COMPLETION',
  },
  {
    label: 'True/False/Not Given Answer',
    value: 'TFN_ANSWER',
  },
];
