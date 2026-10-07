import * as yup from 'yup';

import { ProgramStatus } from '@/types/program';

import { VALIDATION_MESSAGE } from './message';

export const createEditProgramSchema = yup.object().shape({
  code: yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .max(50)
    .matches(/^[A-Z0-9_]+$/, 'Code must be uppercase letters, digits or "_"'),
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRED).max(255),
  description: yup.string().max(1000).optional(),
  status: yup
    .mixed<ProgramStatus>()
    .oneOf(Object.values(ProgramStatus))
    .required(VALIDATION_MESSAGE.REQUIRED),
});

export type CreateEditProgramFormData = yup.InferType<
  typeof createEditProgramSchema
>;
