import type { User } from './user';

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum SortDirection {
  ASC = 'ascending',
  DESC = 'descending',
}

export enum Provider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  LOCAL = 'local',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export type CookieStoreObj = {
  name: string;
  value: string;
};

export type Metadata = Partial<{
  page: number;
  take: number;
  totalCount: number;
}>;

export type Params = Partial<{
  page: number;
  take: number;
  keyword: string;
  sort: string;
  direction: SortDirection;
}>;

export type Response<T> = Partial<{
  data: T;
  meta: Metadata;
}>;

export type Nullable<T> = T | null;

export type Audit = Partial<{
  createdAt: string;
  createdById: string;
  createdBy: User;
  updatedAt: string;
  updatedById: string;
  updatedBy: User;
  deletedAt: string;
  deletedById: string;
}>;

export type Message = Partial<{
  message: string;
  statusCode: number;
}>;

export type Color =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning';

export type Placement =
  | 'top'
  | 'top-end'
  | 'top-start'
  | 'right'
  | 'right-end'
  | 'right-start'
  | 'bottom'
  | 'bottom-end'
  | 'bottom-start'
  | 'left'
  | 'left-end'
  | 'left-start';

export enum DurationUnit {
  DAY = 'day',
  HOUR = 'hour',
  WEEK = 'week',
  MONTH = 'month',
}

export enum FileType {
  IMAGE = 'image',
  DOC = 'doc',
  PDF = 'pdf',
}

export interface IGetDisplayRange {
  page?: number;
  itemsLength: number;
  total: number;
  take?: number;
}

export enum MarkedBy {
  ALPHABET = 'ALPHABET',
  NUMBER = 'NUMBER',
  NONE = 'NONE',
}

export enum Status {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
}

export enum TestType {
  PRACTICE_TEST = 'PRACTICE_TEST',
  FULL_TEST = 'FULL_TEST',
}
