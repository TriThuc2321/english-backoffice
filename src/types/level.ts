import type { Audit, Params, Response } from './common';

export enum LevelStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export type LevelSummary = {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  ageMin?: number | null;
  ageMax?: number | null;
  status: LevelStatus;
};

export type LevelProgram = {
  id: string;
  code: string;
  name: string;
};

export type Level = {
  id: string;
  programId: string;
  program: LevelProgram;
  code: string;
  name: string;
  displayOrder: number;
  ageMin?: number | null;
  ageMax?: number | null;
  status: LevelStatus;
  auditMetadata?: Audit;
};

export type GetLevelsParams = Params &
  Partial<{
    programId: string;
    status: LevelStatus;
  }>;

export type GetLevelsResponse = Response<Level[]>;

export type CreateLevelPayload = {
  programId: string;
  code: string;
  name: string;
  displayOrder?: number;
  ageMin?: number;
  ageMax?: number;
  status?: LevelStatus;
};

export type EditLevelPayload = Partial<CreateLevelPayload> & {
  id: string;
};
