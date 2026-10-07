import type { Audit, Params, Response } from './common';

import { Gender } from './common';

export { Gender };

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum StudentSegment {
  KIDS = 'KIDS',
  TEENS = 'TEENS',
  UNI = 'UNI',
  ADULT = 'ADULT',
}

export enum ParentRelationship {
  MOM = 'MOM',
  DAD = 'DAD',
  OTHER = 'OTHER',
}

export type StudentUserProfile = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
};

export type Student = {
  id: string;
  studentCode: string;
  user: StudentUserProfile;
  entryLevelCode?: string | null;
  segment: StudentSegment;
  parentName?: string | null;
  parentPhone?: string | null;
  parentEmail?: string | null;
  parentRelationship?: ParentRelationship | null;
  note?: string | null;
  status: StudentStatus;
  auditMetadata?: Audit;
};

export type GetStudentsParams = Params &
  Partial<{
    status: StudentStatus;
    segment: StudentSegment;
    entryLevelCode: string;
  }>;

export type GetStudentsResponse = Response<Student[]>;

export type CreateStudentPayload = {
  studentCode?: string;
  firstName: string;
  lastName?: string;
  dob?: string;
  gender?: Gender | null;
  phone?: string;
  email?: string;
  entryLevelCode?: string;
  segment: StudentSegment;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentRelationship?: ParentRelationship | null;
  note?: string;
  status?: StudentStatus;
};

export type EditStudentPayload = Partial<CreateStudentPayload> & {
  id: string;
};
