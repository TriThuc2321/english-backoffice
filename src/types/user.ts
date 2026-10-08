import type {
  Audit,
  EditableStatus,
  Gender,
  Params,
  Provider,
  Response,
  Status,
} from './common';
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
  status: Status;
  systemUser: boolean;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  auditMetadata: Audit;
}>;

export type GetUsersParams = Params & {
  roleId?: number;
  status?: EditableStatus;
};

export type GetUsersResponse = Response<User[]>;

export type CreateUserPayload = Partial<{
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  roleId: number;
}>;

export type EditUserPayload = CreateUserPayload & {
  id: string;
  status?: EditableStatus;
};

export type EditMePayload = Partial<{
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}>;
