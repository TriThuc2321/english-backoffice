import type { Audit, Gender, Params, Provider, Response } from './common';
import type { Role } from './role';

export type User = { id: string } & Partial<{
  roleId: number;
  role: Role;
  email: string;
  avatar: string;
  phone: string;
  provider: Provider;
  providerId: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  isActive: boolean;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  auditMetadata: Audit;
}>;

export type GetUsersParams = Params & {
  roleIds?: number[];
};

export type GetUsersResponse = Response<User[]>;

export type CreateUserPayload = Partial<{
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  roleId: number;
  isActive: boolean;
}>;

export type EditUserPayload = CreateUserPayload & {
  id: string;
};

export type EditMePayload = Partial<{
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}>;
