import * as yup from 'yup';

import { Gender } from '@/types/common';
import {
  SkillArea,
  SkillLevel,
  SkillTargetAudience,
  TeacherStatus,
} from '@/types/teacher';

import { VALIDATION_MESSAGE } from './message';

export const createEditTeacherSchema = yup.object().shape({
  code: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  nationality: yup.string().defined(),
  status: yup
    .mixed<TeacherStatus>()
    .oneOf(Object.values(TeacherStatus))
    .required(VALIDATION_MESSAGE.REQUIRED),
  user: yup
    .object()
    .shape({
      firstName: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
      lastName: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
      email: yup
        .string()
        .email(VALIDATION_MESSAGE.INVALID_EMAIL)
        .required(VALIDATION_MESSAGE.REQUIRED),
      avatar: yup.string().defined(),
      phone: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
      dateOfBirth: yup.string().defined(),
      gender: yup
        .mixed<Gender>()
        .oneOf(Object.values(Gender))
        .nullable()
        .optional(),
      address: yup.string().defined(),
    })
    .defined(),
  skills: yup
    .array()
    .of(
      yup.object().shape({
        targetAudience: yup
          .mixed<SkillTargetAudience>()
          .oneOf(Object.values(SkillTargetAudience))
          .nullable()
          .optional(),
        skillArea: yup
          .mixed<SkillArea>()
          .oneOf(Object.values(SkillArea))
          .nullable()
          .optional(),
        level: yup
          .mixed<SkillLevel>()
          .oneOf(Object.values(SkillLevel))
          .required(VALIDATION_MESSAGE.REQUIRED),
      }),
    )
    .defined(),
  certificates: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
        issuer: yup.string().defined(),
        issueDate: yup.string().defined(),
        expiryDate: yup.string().defined(),
        score: yup.string().defined(),
        fileUrl: yup.string().defined(),
      }),
    )
    .defined(),
});

export type CreateEditTeacherFormData = yup.InferType<
  typeof createEditTeacherSchema
>;
