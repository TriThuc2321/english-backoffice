import * as yup from 'yup';

import { ExamType, SkillType } from '@/types/test';

import type { InferFormInput } from './types';

import { VALIDATION_MESSAGE } from './message';

export const createTestSchema = yup.object().shape({
  examType: yup
    .mixed<ExamType>()
    .oneOf(Object.values(ExamType))
    .required(VALIDATION_MESSAGE.REQUIRED),
  title: yup.string().trim().required(VALIDATION_MESSAGE.REQUIRED).max(255),
  source: yup.string().max(255).defined(),
  durationMinutes: yup.number().integer().min(1).optional(),
  sections: yup
    .array()
    .of(
      yup.object().shape({
        skill: yup
          .mixed<SkillType>()
          .oneOf(Object.values(SkillType))
          .required(),
        enabled: yup.boolean().required(),
        durationMinutes: yup.number().integer().min(1).optional(),
      }),
    )
    .defined(),
});

export type CreateTestFormInput = InferFormInput<typeof createTestSchema>;
export type CreateTestFormData = yup.InferType<typeof createTestSchema>;
