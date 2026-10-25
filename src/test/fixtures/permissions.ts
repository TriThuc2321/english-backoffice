import type { Permission } from '@/types/permission';

const permission = (id: number, action: string, subject: string) =>
  ({ id, action, subject, status: 'ACTIVE' }) as Permission;

export const PERMISSION_ID = {
  FULL: 1,
  MANAGE_USER: 2,
  CREATE_USER: 3,
  READ_USER: 4,
  UPDATE_USER: 5,
  DELETE_USER: 6,
  READ_ROLE: 7,
  UPDATE_ROLE: 8,
  READ_DASHBOARD: 9,
};

// What GET /permissions returns: a "manage all", a subject with manage + CRUD, and partial subjects
export const PERMISSIONS: Permission[] = [
  permission(PERMISSION_ID.FULL, 'manage', 'all'),
  permission(PERMISSION_ID.MANAGE_USER, 'manage', 'user'),
  permission(PERMISSION_ID.CREATE_USER, 'create', 'user'),
  permission(PERMISSION_ID.READ_USER, 'read', 'user'),
  permission(PERMISSION_ID.UPDATE_USER, 'update', 'user'),
  permission(PERMISSION_ID.DELETE_USER, 'delete', 'user'),
  permission(PERMISSION_ID.READ_ROLE, 'read', 'role'),
  permission(PERMISSION_ID.UPDATE_ROLE, 'update', 'role'),
  permission(PERMISSION_ID.READ_DASHBOARD, 'read', 'dashboard'),
];

export const makePermission = permission;
