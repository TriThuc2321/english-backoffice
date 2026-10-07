import type { Audit, MarkedBy, Params, Response, Status } from './common';

export type Passage = { id: string } & Partial<{
  title: string;
  subtitle: string;
  markedBy: MarkedBy;
  status: Status;
  auditMetadata?: Audit;
  paragraphs: Paragraph[];
}>;

export type GetPassageParams = Params & Partial<{ status: Status }>;

export type GetPassagesResponse = Response<Passage[]>;

export type CreatePassagePayload = Partial<{
  title: string;
  subtitle: string;
  markedBy: MarkedBy;
  status: Status;
  paragraphs: Partial<Paragraph>[];
}>;

export type EditPassagePayload = CreatePassagePayload & {
  id: string;
};

export type Paragraph = Partial<{
  id: string;
  content: string;
  passageId: string;
}>;
