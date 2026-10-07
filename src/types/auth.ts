export enum PermissionAction {
  Manage = 'manage',
  Create = 'create',
  Update = 'update',
  Read = 'read',
  Delete = 'delete',
}

export enum SubjectName {
  All = 'all',
  Dashboard = 'dashboard',
  Students = 'student',
  Teachers = 'teacher',
  Tests = 'test',
  Passages = 'passage',
  Questions = 'question',
  Users = 'user',
  Roles = 'role',
  Campuses = 'campus',
  Programs = 'program',
  Levels = 'level',
}

export interface IRequestLogin {
  email: string;
  password: string;
  remember?: boolean;
}

export interface IRequestRegister {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

export interface IRequestResetPassword {
  password: string;
  code: string;
}

export interface ITokenDecoded {
  email: string | null;
  roleId: string;
  id: string;
  permissions: {
    action: string;
    subject: string;
  }[];
  canAccessCms: boolean;
  iat: number;
  exp: number;
}

export type GetDecodedTokenProps = {
  token?: string;
  jwtSecret?: string;
};
