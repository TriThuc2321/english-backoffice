import type { Role, RolePermission } from '../../src/types/role';
import type { User } from '../../src/types/user';

import { Status } from '../../src/types/common';

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
