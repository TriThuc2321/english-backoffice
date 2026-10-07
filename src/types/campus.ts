import type { Audit, Params, Response } from './common';

export enum CampusStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export type Campus = {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  status: CampusStatus;
  auditMetadata?: Audit;
};

export type GetCampusesParams = Params &
  Partial<{
    status: CampusStatus;
  }>;

export type GetCampusesResponse = Response<Campus[]>;

export type CreateCampusPayload = {
  code: string;
  name: string;
  address?: string;
  phone?: string;
  status?: CampusStatus;
};

export type EditCampusPayload = Partial<CreateCampusPayload> & {
  id: string;
};
