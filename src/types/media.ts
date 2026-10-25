import type { Audit, Nullable, Params, Response } from './common';
import type { MediaKind } from './test';

export enum MediaScope {
  TEST = 'TEST',
  AVATAR = 'AVATAR',
}

// ownerId is the test id (as a string) for TEST, the user uuid for AVATAR
type MediaOwner = {
  scope: MediaScope;
  ownerId: string;
};

export type Media = MediaOwner & {
  id: number;
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

export type GetMediaParams = Params & Partial<MediaOwner & { kind: MediaKind }>;

export type GetMediaResponse = Response<Media[]>;

export type UploadUrlPayload = MediaOwner & {
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

export type CreateMediaPayload = MediaOwner & {
  kind: MediaKind;
  storageKey: string;
  durationMs?: number;
  transcript?: string;
};

export type EditMediaPayload = { id: number } & Partial<{
  durationMs: number | null;
  transcript: string | null;
}>;

export type UploadMediaPayload = MediaOwner & {
  kind: MediaKind;
  file: File;
};

export type MyAvatarUploadUrlPayload = {
  contentType: string;
};

export type SetMyAvatarPayload = {
  storageKey: string;
};

export type MyAvatarResponse = {
  avatar: string | null;
};
