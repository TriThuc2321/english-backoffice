import * as yup from 'yup';

import { LevelStatus } from '@/types/level';

import { VALIDATION_MESSAGE } from './message';

export const createEditLevelSchema = yup.object().shape({
  code: yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .max(50)
    .matches(/^[A-Z0-9_]+$/, 'Code must be uppercase letters, digits or "_"'),
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRED).max(255),
  displayOrder: yup.number().integer().min(0).optional(),
  ageMin: yup.number().integer().min(0).nullable().optional(),
  ageMax: yup.number().integer().min(0).nullable().optional(),
  status: yup
    .mixed<LevelStatus>()
    .oneOf(Object.values(LevelStatus).filter((v) => v !== LevelStatus.DELETED))
    .optional(),
});

export type CreateEditLevelFormData = yup.InferType<
  typeof createEditLevelSchema
>;
