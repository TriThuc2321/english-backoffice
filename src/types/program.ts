import type { Audit, Params, Response } from './common';
import type { LevelSummary } from './level';

export enum ProgramStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export type Program = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  status: ProgramStatus;
  levels?: LevelSummary[];
  auditMetadata?: Audit;
};

export type GetProgramsParams = Params &
  Partial<{
    status: ProgramStatus;
  }>;

export type GetProgramsResponse = Response<Program[]>;

export type CreateProgramPayload = {
  code: string;
  name: string;
  description?: string;
  status?: ProgramStatus;
};

export type EditProgramPayload = Partial<CreateProgramPayload> & {
  id: string;
};
