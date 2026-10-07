import type { Audit, Params, Response } from './common';
import type { Passage } from './passage';

export enum IELTSSkill {
  READING = 'READING',
  LISTENING = 'LISTENING',
  WRITING = 'WRITING',
  SPEAKING = 'SPEAKING',
}

export enum TestType {
  PLACEMENT = 'PLACEMENT',
  PROGRESS = 'PROGRESS',
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  PRACTICE = 'PRACTICE',
}

export enum PublishStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export type Test = {
  id: string;
  title?: string;
  code?: string;
  skill?: IELTSSkill;
  type?: TestType;
  band?: string;
  durationMin?: number;
  totalQuestions?: number;
  publishStatus?: PublishStatus;
  sectionCount?: number;
  attempts?: number;
  avgBand?: number | null;
  sections?: TestSection[];
  auditMetadata?: Audit;
};

export type GetTestsParams = Params &
  Partial<{
    keyword: string;
    skill: IELTSSkill;
    type: TestType;
  }>;

export type GetTestsResponse = Response<Test[]>;

export type CreateTestPayload = {
  title: string;
  code: string;
  skill?: IELTSSkill;
  type?: TestType;
  band?: string;
  durationMin?: number;
  totalQuestions?: number;
  publishStatus?: PublishStatus;
};

export type EditTestPayload = Partial<CreateTestPayload> & {
  id: string;
};

export enum QuestionType {
  SINGLE_ANSWER = 'SINGLE_ANSWER',
  MULTIPLE_ANSWER = 'MULTIPLE_ANSWER',
  YNN_ANSWER = 'YNN_ANSWER',
  MATCHING_PARAGRAPH = 'MATCHING_PARAGRAPH',
  NOTE_COMPLETION_WITH_HINT = 'NOTE_COMPLETION_WITH_HINT',
  NOTE_COMPLETION_NO_HINT = 'NOTE_COMPLETION_NO_HINT',
  DIAGRAM_LABEL_COMPLETION = 'DIAGRAM_LABEL_COMPLETION',
  TFN_ANSWER = 'TFN_ANSWER',
}

export type QuestionGroup = {
  id: string;
  guideline: string;
  testSectionId?: string;
  order?: number;
  auditMetadata?: Audit;
} & (
  | {
      questions: Question<SingleAnswerContent>[];
      questionType: QuestionType.SINGLE_ANSWER;
    }
  | {
      questions: Question<MultipleAnswerContent>[];
      questionType: QuestionType.MULTIPLE_ANSWER;
    }
  | {
      questions: Question<TfnContent>[];
      questionType: QuestionType.TFN_ANSWER;
    }
  | {
      questions: Question<YnnContent>[];
      questionType: QuestionType.YNN_ANSWER;
    }
  | {
      questions: Question<MatchingParagraphContent>[];
      questionType: QuestionType.MATCHING_PARAGRAPH;
    }
  | {
      questions: Question<NoteHintContent>[];
      questionType: QuestionType.NOTE_COMPLETION_WITH_HINT;
    }
  | {
      questions: Question<NoteNoHintContent>[];
      questionType: QuestionType.NOTE_COMPLETION_NO_HINT;
    }
  | {
      questions: Question<DiagramLabelContent>[];
      questionType: QuestionType.DIAGRAM_LABEL_COMPLETION;
    }
);

export type Question<C = QuestionContent> = {
  uuid: string;
  order: number;
  content: C;
  /** Inclusive range start; MULTIPLE_ANSWER spans one number per correct option. */
  questionNumber?: number;
  id?: string;
  questionGroupId?: string;
  auditMetadata?: Audit;
};

type BaseContent = {
  explanation?: string;
};

export type McqOption = {
  id: string;
  label: string;
  text: string;
};

export type SingleAnswerContent = BaseContent & {
  text: string;
  options: McqOption[];
  answer: { optionId: string | null };
};

export type MultipleAnswerContent = BaseContent & {
  text: string;
  options: McqOption[];
  answer: { optionIds: string[] };
};

export type TfnValue = 'TRUE' | 'FALSE' | 'NOT_GIVEN';
export type YnnValue = 'YES' | 'NO' | 'NOT_GIVEN';

export type TfnContent = BaseContent & {
  statement: string;
  answer: { value: TfnValue | null };
};

export type YnnContent = BaseContent & {
  statement: string;
  answer: { value: YnnValue | null };
};

export type MatchingParagraphContent = BaseContent & {
  statement: string;
  answer: { paragraphLabel: string | null };
};

export type MaxWords =
  | 'ONE_WORD'
  | 'TWO_WORDS'
  | 'ONE_WORD_OR_NUMBER'
  | 'NO_MORE_THAN_TWO_WORDS'
  | 'NO_MORE_THAN_THREE_WORDS';

export type NoteHintContent = BaseContent & {
  before: string;
  after: string;
  maxWords: MaxWords;
  wordBank: string[];
  answer: { value: string | null };
};

export type NoteNoHintContent = BaseContent & {
  before: string;
  after: string;
  maxWords: MaxWords;
  answer: { acceptedValues: string[] };
};

export type DiagramLayout = 'listed' | 'positioned';

export type DiagramLabelContent = BaseContent & {
  imageUrl: string;
  layout: DiagramLayout;
  hint: string;
  x?: number;
  y?: number;
  answer: { value: string };
};

export type QuestionContent =
  | SingleAnswerContent
  | MultipleAnswerContent
  | TfnContent
  | YnnContent
  | MatchingParagraphContent
  | NoteHintContent
  | NoteNoHintContent
  | DiagramLabelContent;

export type TestSection = {
  id: string;
  questionGroups: QuestionGroup[];
  passage?: Passage;
  testId?: string;
  passageId?: string | null;
  order?: number;
  auditMetadata?: Audit;
};

export type GetTestSectionParams = Params &
  Partial<{
    testId: string;
    passageId: string;
  }>;

export type GetTestSectionsResponse = Response<TestSection[]>;

export type CreateTestSectionPayload = {
  testId: string;
  passageId?: string | null;
};

export type EditTestSectionPayload = Partial<CreateTestSectionPayload> & {
  id: string;
};

export type GetQuestionGroupParams = Params &
  Partial<{
    testSectionId: string;
    questionType: QuestionType;
  }>;

export type GetQuestionGroupsResponse = Response<QuestionGroup[]>;

export type CreateQuestionPayload = {
  uuid: string;
  order: number;
  content: Record<string, any>;
};

export type CreateQuestionGroupPayload = {
  testSectionId: string;
  questionType: QuestionType;
  guideline: string;
  questions?: CreateQuestionPayload[];
};

export type EditQuestionGroupPayload = Partial<CreateQuestionGroupPayload> & {
  id: string;
};
