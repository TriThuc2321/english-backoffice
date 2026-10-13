import type { Audit, Nullable, Params, Response } from './common';

export enum ExamType {
  IELTS_ACADEMIC = 'IELTS_ACADEMIC',
  IELTS_GENERAL = 'IELTS_GENERAL',
  TOEIC_LR = 'TOEIC_LR',
  TOEIC_SW = 'TOEIC_SW',
}

export enum SkillType {
  LISTENING = 'LISTENING',
  READING = 'READING',
  WRITING = 'WRITING',
  SPEAKING = 'SPEAKING',
}

export enum TestStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
}

export type EditableTestStatus = TestStatus.PUBLISHED | TestStatus.DRAFT;

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_CHOICE_MULTI = 'MULTIPLE_CHOICE_MULTI',
  TRUE_FALSE_NOT_GIVEN = 'TRUE_FALSE_NOT_GIVEN',
  YES_NO_NOT_GIVEN = 'YES_NO_NOT_GIVEN',
  MATCHING_HEADINGS = 'MATCHING_HEADINGS',
  MATCHING_INFORMATION = 'MATCHING_INFORMATION',
  MATCHING_FEATURES = 'MATCHING_FEATURES',
  MATCHING_SENTENCE_ENDINGS = 'MATCHING_SENTENCE_ENDINGS',
  CLASSIFICATION = 'CLASSIFICATION',
  FORM_COMPLETION = 'FORM_COMPLETION',
  SENTENCE_COMPLETION = 'SENTENCE_COMPLETION',
  SUMMARY_COMPLETION = 'SUMMARY_COMPLETION',
  NOTE_COMPLETION = 'NOTE_COMPLETION',
  TABLE_COMPLETION = 'TABLE_COMPLETION',
  FLOW_CHART_COMPLETION = 'FLOW_CHART_COMPLETION',
  DIAGRAM_LABELLING = 'DIAGRAM_LABELLING',
  MAP_LABELLING = 'MAP_LABELLING',
  PLAN_LABELLING = 'PLAN_LABELLING',
  SHORT_ANSWER = 'SHORT_ANSWER',
  PHOTO_DESCRIPTION = 'PHOTO_DESCRIPTION',
  QUESTION_RESPONSE = 'QUESTION_RESPONSE',
  TEXT_COMPLETION = 'TEXT_COMPLETION',
  READ_ALOUD = 'READ_ALOUD',
  DESCRIBE_PICTURE = 'DESCRIBE_PICTURE',
  RESPOND_TO_QUESTIONS = 'RESPOND_TO_QUESTIONS',
  RESPOND_USING_INFO = 'RESPOND_USING_INFO',
  EXPRESS_OPINION = 'EXPRESS_OPINION',
  WRITE_SENTENCE_PICTURE = 'WRITE_SENTENCE_PICTURE',
  RESPOND_WRITTEN_REQUEST = 'RESPOND_WRITTEN_REQUEST',
  OPINION_ESSAY = 'OPINION_ESSAY',
}

export enum MediaKind {
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
}

// Shape of `content` / `answer` depends on questionType (see docs/question-formats.md)
export type QuestionContent = Record<string, unknown>;
export type QuestionAnswer = Record<string, unknown>;

export type QuestionEvidence = Partial<{
  paragraphId: number;
  quote: string;
}>;

export type Test = {
  id: number;
  examType: ExamType;
  title: string;
  source: Nullable<string>;
  durationMinutes: Nullable<number>;
  status: TestStatus;
  publishedAt: Nullable<string>;
  lockedAt: Nullable<string>;
  auditMetadata?: Audit;
  testSections?: TestSection[];
};

export type TestSection = {
  id: number;
  testId: number;
  skill: SkillType;
  order: number;
  durationMinutes: Nullable<number>;
};

export type TestPart = {
  id: number;
  sectionId: number;
  order: number;
  title: Nullable<string>;
  instruction: Nullable<string>;
  audioMediaId: Nullable<number>;
  audioStartMs: Nullable<number>;
  audioEndMs: Nullable<number>;
};

export type GroupPassage = {
  groupId: number;
  passageId: number;
  order: number;
  passage: { id: number; title: string; subtitle: Nullable<string> };
};

export type QuestionGroup = {
  id: number;
  partId: number;
  order: number;
  questionType: QuestionType;
  instruction: Nullable<string>;
  wordLimit: Nullable<number>;
  content: Nullable<QuestionContent>;
  audioMediaId: Nullable<number>;
  imageMediaId: Nullable<number>;
  groupPassages: GroupPassage[];
  questions?: Question[];
};

export type Question = {
  id: number;
  groupId: number;
  numberFrom: number;
  numberTo: number;
  order: number;
  prompt: Nullable<string>;
  content: Nullable<QuestionContent>;
  answer: QuestionAnswer;
  explanation: Nullable<string>;
  evidence: Nullable<QuestionEvidence>;
  audioMediaId: Nullable<number>;
  imageMediaId: Nullable<number>;
  audioStartMs: Nullable<number>;
};

export type DeleteResponse = { deleted: number };

export type ReorderPayload<K extends string> = Record<K, number> & {
  ids: number[];
};

// Tests
export type GetTestsParams = Params &
  Partial<{ status: EditableTestStatus; examType: ExamType }>;

export type GetTestsResponse = Response<Test[]>;

export type CreateTestPayload = {
  examType: ExamType;
  title: string;
  source?: string;
  durationMinutes?: number;
  sections?: Array<{
    skill: SkillType;
    order?: number;
    durationMinutes?: number;
  }>;
};

export type EditTestPayload = { id: number } & Partial<{
  examType: ExamType;
  title: string;
  source: string;
  durationMinutes: number;
  status: EditableTestStatus;
}>;

// Sections
export type CreateTestSectionPayload = {
  testId: number;
  skill: SkillType;
  order?: number;
  durationMinutes?: number;
};

export type EditTestSectionPayload = { id: number } & Partial<
  Omit<CreateTestSectionPayload, 'testId'>
>;

export type ReorderTestSectionsPayload = ReorderPayload<'testId'>;

// Parts
export type CreateTestPartPayload = {
  sectionId: number;
  order?: number;
  title?: string;
  instruction?: string;
  audioMediaId?: number;
  audioStartMs?: number;
  audioEndMs?: number;
};

export type EditTestPartPayload = { id: number } & Partial<
  Omit<CreateTestPartPayload, 'sectionId'>
>;

export type ReorderTestPartsPayload = ReorderPayload<'sectionId'>;

// Questions
export type QuestionInput = {
  numberFrom: number;
  numberTo?: number;
  order?: number;
  prompt?: string;
  content?: QuestionContent;
  answer: QuestionAnswer;
  explanation?: string;
  evidence?: QuestionEvidence;
  audioMediaId?: number;
  imageMediaId?: number;
  audioStartMs?: number;
};

export type CreateQuestionPayload = QuestionInput & { groupId: number };

// Locked test: only answer / explanation / evidence are accepted
export type EditQuestionPayload = { id: number } & Partial<QuestionInput>;

export type ReorderQuestionsPayload = ReorderPayload<'groupId'>;

// Question groups
export type CreateQuestionGroupPayload = {
  partId: number;
  order?: number;
  questionType: QuestionType;
  instruction?: string;
  wordLimit?: number;
  content?: QuestionContent;
  audioMediaId?: number;
  imageMediaId?: number;
  passageIds?: number[];
  questions?: QuestionInput[];
};

// passageIds, when sent, replaces all links ([] removes them)
export type EditQuestionGroupPayload = { id: number } & Partial<
  Omit<CreateQuestionGroupPayload, 'partId' | 'questions'>
>;

export type ReorderQuestionGroupsPayload = ReorderPayload<'partId'>;
