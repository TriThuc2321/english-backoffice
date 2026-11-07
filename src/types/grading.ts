import type { Nullable, Params, Response } from './common';
import type {
  ExamType,
  QuestionContent,
  QuestionType,
  SkillType,
} from './test';

export enum GradingStatus {
  AUTO_GRADED = 'AUTO_GRADED',
  PENDING = 'PENDING',
  GRADED = 'GRADED',
}

export type GradingQueueStatus = GradingStatus.PENDING | GradingStatus.GRADED;

export type GradingSkill = SkillType.WRITING | SkillType.SPEAKING;

export type GradingUser = {
  id: string;
  email: Nullable<string>;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
};

export type AssessmentEntry = {
  partId: Nullable<number>;
  criteria: Record<string, number>;
  band: number;
  feedback: Nullable<string>;
};

export type Assessment = {
  id: string;
  revision: number;
  band: number;
  entries: AssessmentEntry[];
  grader: GradingUser;
  createdAt: string;
};

export type GradingTest = {
  id: number;
  title: string;
  examType: ExamType;
};

export type GradingQueueItem = {
  attemptSectionId: string;
  attemptId: string;
  student: GradingUser;
  test: GradingTest;
  skill: GradingSkill;
  submittedAt: Nullable<string>;
  gradingStatus: GradingStatus;
  band: Nullable<number>;
  grader: Nullable<GradingUser>;
};

export type GradingExpectedEntry = {
  partId: Nullable<number>;
  task: Nullable<1 | 2>;
  criteria: string[];
};

export type GradingResponse = {
  text: Nullable<string>;
  wordCount: Nullable<number>;
  audioUrl: Nullable<string>;
};

export type GradingQuestion = {
  questionId: number;
  numberFrom: number;
  questionType: QuestionType;
  instruction: Nullable<string>;
  prompt: Nullable<string>;
  content: Nullable<QuestionContent>;
  imageUrl: Nullable<string>;
  audioUrl: Nullable<string>;
  sample: Nullable<string>;
  rubric: Nullable<Record<string, unknown>>;
  response: Nullable<GradingResponse>;
};

export type GradingPart = {
  partId: number;
  order: number;
  title: Nullable<string>;
  instruction: Nullable<string>;
  questions: GradingQuestion[];
};

export type GradingSection = {
  attemptSectionId: string;
  attemptId: string;
  student: GradingUser;
  test: GradingTest;
  skill: GradingSkill;
  submittedAt: Nullable<string>;
  gradingStatus: GradingStatus;
  // 0 when not graded yet
  revision: number;
  assessment: Nullable<Assessment>;
  expectedEntries: GradingExpectedEntry[];
  parts: GradingPart[];
};

export type GetGradingQueueParams = Params &
  Partial<{
    gradingStatus: GradingQueueStatus;
    skill: GradingSkill;
    testId: number;
  }>;

export type GetGradingQueueResponse = Response<GradingQueueItem[]>;

export type AssessmentEntryInput = {
  partId: Nullable<number>;
  criteria: Record<string, number>;
  feedback?: string;
};

export type CreateAssessmentPayload = {
  id: string;
  expectedRevision: number;
  entries: AssessmentEntryInput[];
};

export const ASSESSMENT_ERROR = {
  REVISION_CONFLICT: 'ASSESSMENT_REVISION_CONFLICT',
  NOT_GRADABLE: 'SECTION_NOT_GRADABLE',
} as const;
