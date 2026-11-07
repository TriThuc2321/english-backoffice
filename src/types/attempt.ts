import type { MarkedBy, Nullable, Params, Response } from './common';
import type { GradingStatus, GradingUser } from './grading';
import type { ExamType, MediaKind, QuestionType, SkillType } from './test';

export enum AttemptMode {
  FULL = 'FULL',
  SECTION = 'SECTION',
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  EXPIRED = 'EXPIRED',
}

export enum AttemptSectionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  EXPIRED = 'EXPIRED',
}

export type AttemptSection = {
  id: string;
  sectionId: number;
  skill: SkillType;
  order: number;
  status: AttemptSectionStatus;
  startedAt: Nullable<string>;
  deadlineAt: Nullable<string>;
  submittedAt: Nullable<string>;
  gradingStatus: Nullable<GradingStatus>;
  rawScore: Nullable<number>;
  maxScore: Nullable<number>;
  scaledScore: Nullable<number>;
};

export type AttemptTest = {
  id: number;
  slug: string;
  title: string;
  examType: ExamType;
};

export type AttemptListItem = {
  id: string;
  testId: number;
  testSlug: string;
  mode: AttemptMode;
  status: AttemptStatus;
  startedAt: string;
  deadlineAt: Nullable<string>;
  submittedAt: Nullable<string>;
  overallScore: Nullable<number>;
  sections: AttemptSection[];
  test: AttemptTest;
};

export type StudentAttemptItem = AttemptListItem & { student: GradingUser };

export type AttemptResponse =
  | { key: string }
  | { keys: string[] }
  | { text: string }
  | { mediaId: number };

export type AttemptAnswerKey =
  | { key: string }
  | { keys: string[] }
  | { accepted: string[] }
  | { sample?: string; rubric?: Record<string, unknown> };

export type AttemptResultQuestion = {
  questionId: number;
  sectionId: number;
  numberFrom: number;
  numberTo: number;
  response: Nullable<AttemptResponse>;
  isCorrect: Nullable<boolean>;
  score: number;
  maxScore: number;
  flagged: boolean;
  answer: AttemptAnswerKey;
  explanation: Nullable<string>;
  evidence: Nullable<{ paragraphId?: number; quote?: string }>;
  audioUrl: Nullable<string>;
};

export type AttemptAssessment = {
  attemptSectionId: string;
  band: number;
  entries: {
    partId: Nullable<number>;
    criteria: Record<string, number>;
    band: number;
    feedback: Nullable<string>;
  }[];
};

export type AttemptResult = {
  attempt: AttemptListItem;
  questions: AttemptResultQuestion[];
  transcripts: { mediaId: number; transcript: string }[];
  assessments: AttemptAssessment[];
  student: GradingUser;
};

export type ContentMedia = {
  id: number;
  kind: MediaKind;
  mimeType: Nullable<string>;
  durationMs: Nullable<number>;
  url: string;
};

export type ContentPassage = {
  id: number;
  title: string;
  subtitle: Nullable<string>;
  markedBy: MarkedBy;
  paragraphs: { id: number; content: string; order: number }[];
};

export type ContentOption = { key: string; text?: string };

export type ContentQuestion = {
  id: number;
  numberFrom: number;
  numberTo: number;
  order: number;
  prompt: Nullable<string>;
  content: Nullable<{ options?: ContentOption[] }>;
  audio: Nullable<ContentMedia>;
  image: Nullable<ContentMedia>;
};

export type ContentQuestionGroup = {
  id: number;
  order: number;
  questionType: QuestionType;
  instruction: Nullable<string>;
  content: Nullable<{
    options?: ContentOption[];
    template?: string;
    table?: { headers?: string[]; rows: string[][] };
    info?: { title?: string; rows: string[][] };
  }>;
  audio: Nullable<ContentMedia>;
  image: Nullable<ContentMedia>;
  passages: ContentPassage[];
  questions: ContentQuestion[];
};

export type ContentPart = {
  id: number;
  order: number;
  title: Nullable<string>;
  instruction: Nullable<string>;
  audio: Nullable<ContentMedia>;
  passage: Nullable<ContentPassage>;
  questionGroups: ContentQuestionGroup[];
};

export type AttemptContent = {
  id: number;
  slug: string;
  title: string;
  examType: ExamType;
  testSections: {
    id: number;
    skill: SkillType;
    order: number;
    testParts: ContentPart[];
  }[];
};

export type GetAttemptsParams = Params &
  Partial<{
    userId: string;
    testId: number;
    status: AttemptStatus;
    examType: ExamType;
  }>;

export type GetAttemptsResponse = Response<StudentAttemptItem[]>;

export const ATTEMPT_ERROR = {
  NOT_GRADED: 'ATTEMPT_NOT_GRADED',
} as const;
