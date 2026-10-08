import type { Audit, EditableStatus, Params, Response, Status } from './common';

export interface RolePermission {
  action: string;
  subject: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  canAccessCms: boolean;
  status: Status;
  systemRole: boolean;
  permissions: RolePermission[];
  auditMetadata?: Audit;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  canAccessCms: boolean;
  permissionIds?: number[];
}

export interface EditRolePayload extends Partial<CreateRolePayload> {
  id: string;
  status?: EditableStatus;
}

export interface GetRolesParams extends Params {
  status?: EditableStatus;
  canAccessCms?: boolean;
}

export type GetRolesResponse = Response<Role[]>;
