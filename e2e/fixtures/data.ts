import type {
  GradingQueueItem,
  GradingSection,
  GradingUser,
} from '../../src/types/grading';
import type { Passage } from '../../src/types/passage';
import type { Role, RolePermission } from '../../src/types/role';
import type { User } from '../../src/types/user';

import { MarkedBy, Status } from '../../src/types/common';
import { GradingStatus } from '../../src/types/grading';
import { PassageStatus } from '../../src/types/passage';
import { ExamType, QuestionType, SkillType } from '../../src/types/test';

export const FULL_ACCESS: RolePermission[] = [
  { action: 'manage', subject: 'all' },
];

export const READ_USERS_ONLY: RolePermission[] = [
  { action: 'read', subject: 'dashboard' },
  { action: 'read', subject: 'user' },
];

export const makeRole = (overrides: Partial<Role> = {}): Role => ({
  id: 1,
  name: 'Admin',
  code: 'ADMIN',
  canAccessCms: true,
  status: Status.ACTIVE,
  systemRole: false,
  permissions: [],
  ...overrides,
});

export const ROLES: Role[] = [
  makeRole({ permissions: FULL_ACCESS }),
  makeRole({ id: 2, name: 'Teacher', code: 'TEACHER' }),
];

export const makeProfile = (permissions: RolePermission[]): User => ({
  id: 'me',
  email: 'admin@myenglish.vn',
  firstName: 'Ada',
  lastName: 'Admin',
  status: Status.ACTIVE,
  roleId: 1,
  role: makeRole({ permissions }),
});

export const makeUser = (
  index: number,
  overrides: Partial<User> = {},
): User => ({
  id: `user-${index}`,
  email: `user${index}@myenglish.vn`,
  firstName: 'User',
  lastName: String(index),
  status: Status.ACTIVE,
  roleId: 2,
  role: ROLES[1],
  systemUser: false,
  ...overrides,
});

export const USERS: User[] = Array.from({ length: 25 }, (_, i) =>
  makeUser(i + 1),
);

export const READ_ROLES_ONLY: RolePermission[] = [
  { action: 'read', subject: 'dashboard' },
  { action: 'read', subject: 'role' },
];

export const READ_PASSAGES_ONLY: RolePermission[] = [
  { action: 'read', subject: 'dashboard' },
  { action: 'read', subject: 'passage' },
];

const permission = (id: number, action: string, subject: string) => ({
  id,
  action,
  subject,
  status: 'ACTIVE',
});

// GET /permissions: "manage all" plus manage + CRUD for user and role
export const PERMISSIONS = [
  permission(1, 'manage', 'all'),
  ...['user', 'role'].flatMap((subject, i) =>
    ['manage', 'create', 'read', 'update', 'delete'].map((action, j) =>
      permission(10 * (i + 1) + j, action, subject),
    ),
  ),
];

export const permissionId = (action: string, subject: string) =>
  PERMISSIONS.find((p) => p.action === action && p.subject === subject)!.id;

export const makePassage = (
  index: number,
  overrides: Partial<Passage> = {},
): Passage => ({
  id: `passage-${index}`,
  title: `Passage ${index}`,
  subtitle: `Subtitle ${index}`,
  markedBy: MarkedBy.ALPHABET,
  status: PassageStatus.DRAFT,
  paragraphs: [
    { id: `p${index}-1`, content: `First paragraph of ${index}` },
    { id: `p${index}-2`, content: `Second paragraph of ${index}` },
  ],
  ...overrides,
});

export const PASSAGES: Passage[] = Array.from({ length: 15 }, (_, i) =>
  makePassage(i + 1),
);

/** Serves `items` as a `{ data, meta }` page using the page/take query. */
export const paginate =
  <T>(items: T[]) =>
  ({ query }: { query: URLSearchParams }) => {
    const page = Number(query.get('page') ?? 1);
    const take = Number(query.get('take') ?? 10);
    return {
      body: {
        data: items.slice((page - 1) * take, page * take),
        meta: { page, take, totalCount: items.length },
      },
    };
  };

export const STUDENT: GradingUser = {
  id: 'student-1',
  email: 'an.nguyen@myenglish.vn',
  firstName: 'An',
  lastName: 'Nguyen',
};

export const GRADER: GradingUser = {
  id: 'teacher-1',
  email: 'lan.pham@myenglish.vn',
  firstName: 'Lan',
  lastName: 'Pham',
};

const IELTS_TEST = {
  id: 7,
  title: 'IELTS Academic Mock 1',
  examType: ExamType.IELTS_ACADEMIC,
};

export const makeQueueItem = (
  index: number,
  overrides: Partial<GradingQueueItem> = {},
): GradingQueueItem => ({
  attemptSectionId: `section-${index}`,
  attemptId: `attempt-${index}`,
  student: STUDENT,
  test: IELTS_TEST,
  skill: SkillType.WRITING,
  submittedAt: '2026-11-05T10:00:00.000Z',
  gradingStatus: GradingStatus.PENDING,
  band: null,
  grader: null,
  ...overrides,
});

const T1 = ['TA', 'CC', 'LR', 'GRA'];
const T2 = ['TR', 'CC', 'LR', 'GRA'];

const writingQuestion = (
  partId: number,
  questionType: QuestionType,
  text: string | null,
) => ({
  questionId: partId * 10,
  numberFrom: partId === 12 ? 1 : 2,
  questionType,
  instruction: null,
  prompt: `Prompt of part ${partId}`,
  content: null,
  imageUrl: null,
  audioUrl: null,
  sample: `Sample of part ${partId}`,
  rubric: null,
  response: text === null ? null : { text, wordCount: 3, audioUrl: null },
});

export const makeWritingSection = (
  overrides: Partial<GradingSection> = {},
): GradingSection => ({
  attemptSectionId: 'section-1',
  attemptId: 'attempt-1',
  student: STUDENT,
  test: IELTS_TEST,
  skill: SkillType.WRITING,
  submittedAt: '2026-11-05T10:00:00.000Z',
  gradingStatus: GradingStatus.PENDING,
  revision: 0,
  assessment: null,
  expectedEntries: [
    { partId: 12, task: 1, criteria: T1 },
    { partId: 13, task: 2, criteria: T2 },
  ],
  parts: [
    {
      partId: 12,
      order: 1,
      title: 'Task 1',
      instruction: null,
      questions: [
        writingQuestion(
          12,
          QuestionType.IELTS_WRITING_TASK_1,
          'Chart essay here',
        ),
      ],
    },
    {
      partId: 13,
      order: 2,
      title: 'Task 2',
      instruction: null,
      questions: [
        writingQuestion(
          13,
          QuestionType.IELTS_WRITING_TASK_2,
          'Opinion essay here',
        ),
      ],
    },
  ],
  ...overrides,
});

export const makeSpeakingSection = (
  overrides: Partial<GradingSection> = {},
): GradingSection => ({
  ...makeWritingSection(),
  attemptSectionId: 'section-2',
  skill: SkillType.SPEAKING,
  expectedEntries: [
    { partId: null, task: null, criteria: ['FC', 'LR', 'GRA', 'P'] },
  ],
  parts: [
    {
      partId: 21,
      order: 1,
      title: 'Part 2',
      instruction: null,
      questions: [
        {
          questionId: 210,
          numberFrom: 1,
          questionType: QuestionType.IELTS_SPEAKING_PART_2,
          instruction: null,
          prompt: 'Describe a place you visited',
          content: { prepSeconds: 60, responseSeconds: 120 },
          imageUrl: null,
          audioUrl: null,
          sample: null,
          rubric: null,
          response: {
            text: null,
            wordCount: null,
            audioUrl: '/e2e-audio/answer.webm',
          },
        },
      ],
    },
  ],
  ...overrides,
});
