import type { Audit, MarkedBy, Params, Response } from './common';

export enum PassageStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
}

export type EditablePassageStatus =
  | PassageStatus.PUBLISHED
  | PassageStatus.DRAFT;

export type Passage = { id: string } & Partial<{
  title: string;
  subtitle: string;
  markedBy: MarkedBy;
  status: PassageStatus;
  auditMetadata?: Audit;
  paragraphs: Paragraph[];
}>;

export type GetPassageParams = Params &
  Partial<{ status: EditablePassageStatus; markedBy: MarkedBy }>;

export type GetPassagesResponse = Response<Passage[]>;

export type CreatePassagePayload = Partial<{
  title: string;
  subtitle: string;
  markedBy: MarkedBy;
  paragraphs: Partial<Paragraph>[];
}>;

export type EditPassagePayload = CreatePassagePayload & {
  id: string;
  status?: EditablePassageStatus;
};

export type Paragraph = Partial<{
  id: string;
  content: string;
  passageId: string;
}>;
