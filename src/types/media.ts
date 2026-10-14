import type { Audit, Nullable, Params, Response } from './common';
import type { MediaKind } from './test';

export type Media = {
  id: number;
  testId: number;
  kind: MediaKind;
  storageKey: string;
  url: string;
  mimeType: Nullable<string>;
  // bigint serialized as a string
  sizeBytes: Nullable<string>;
  durationMs: Nullable<number>;
  transcript: Nullable<string>;
  auditMetadata?: Audit;
};

export type GetMediaParams = Params &
  Partial<{ testId: number; kind: MediaKind }>;

export type GetMediaResponse = Response<Media[]>;

export type UploadUrlPayload = {
  testId: number;
  kind: MediaKind;
  contentType: string;
};

export type UploadUrlResult = {
  storageKey: string;
  uploadUrl: string;
  // Must be sent exactly as returned on the PUT
  headers: Record<string, string>;
  expiresIn: number;
};

export type CreateMediaPayload = {
  testId: number;
  kind: MediaKind;
  storageKey: string;
  durationMs?: number;
  transcript?: string;
};

export type EditMediaPayload = { id: number } & Partial<{
  durationMs: number | null;
  transcript: string | null;
}>;

export type UploadMediaPayload = {
  testId: number;
  kind: MediaKind;
  file: File;
};
