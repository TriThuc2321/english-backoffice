import type { Audit, Params, Response } from './common';

export enum RoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export interface RolePermission {
  action: string;
  subject: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  canAccessCms: boolean;
  status: RoleStatus;
  permissions: RolePermission[];
  auditMetadata?: Audit;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  status: RoleStatus;
  canAccessCms: boolean;
  permissionIds?: number[];
}

export interface EditRolePayload extends Partial<CreateRolePayload> {
  id: string;
}

export interface GetRolesParams extends Params {
  status?: RoleStatus;
}

export type GetRolesResponse = Response<Role[]>;
