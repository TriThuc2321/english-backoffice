import type { Passage } from '../../src/types/passage';
import type { Role, RolePermission } from '../../src/types/role';
import type { User } from '../../src/types/user';

import { MarkedBy, Status } from '../../src/types/common';
import { PassageStatus } from '../../src/types/passage';

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
