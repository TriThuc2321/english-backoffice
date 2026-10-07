import type { Audit, Params, Response } from './common';

import { Gender } from './common';

export { Gender };

export enum TeacherStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum SkillTargetAudience {
  KIDS = 'KIDS',
  TEEN = 'TEEN',
  ADULT = 'ADULT',
}

export enum SkillArea {
  IELTS = 'IELTS',
  TOEIC = 'TOEIC',
  SPEAKING = 'SPEAKING',
  GRAMMAR = 'GRAMMAR',
  GENERAL = 'GENERAL',
}

export enum SkillLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export type TeacherUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  address?: string | null;
};

export type TeacherSkill = {
  id: string;
  targetAudience?: SkillTargetAudience | null;
  skillArea?: SkillArea | null;
  level: SkillLevel;
};

export type TeacherCertificate = {
  id: string;
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  score?: string | null;
  fileUrl?: string | null;
};

export type Teacher = {
  id: string;
  userId: string;
  code: string;
  nationality?: string | null;
  status: TeacherStatus;
  user: TeacherUser;
  skills: TeacherSkill[];
  certificates: TeacherCertificate[];
  auditMetadata?: Audit;
};

export type GetTeachersParams = Params &
  Partial<{
    status: TeacherStatus;
    skillArea: SkillArea;
    targetAudience: SkillTargetAudience;
  }>;

export type GetTeachersResponse = Response<Teacher[]>;

export type CreateTeacherPayload = {
  code: string;
  status: TeacherStatus;
  nationality: string;
  user: Omit<TeacherUser, 'id'>;
  userId?: string;
  skills: Omit<TeacherSkill, 'id'>[];
  certificates: Omit<TeacherCertificate, 'id'>[];
};

export type EditTeacherPayload = Partial<
  Omit<CreateTeacherPayload, 'userId'>
> & {
  id: string;
};
