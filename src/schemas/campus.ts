import * as yup from 'yup';

import { CampusStatus } from '@/types/campus';

import { VALIDATION_MESSAGE } from './message';

export const createEditCampusSchema = yup.object().shape({
  code: yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .max(32)
    .matches(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, digits or "-"'),
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRED).max(255),
  address: yup.string().max(500).optional(),
  phone: yup.string().max(32).optional(),
  status: yup
    .mixed<CampusStatus>()
    .oneOf(Object.values(CampusStatus))
    .required(VALIDATION_MESSAGE.REQUIRED),
});

export type CreateEditCampusFormData = yup.InferType<
  typeof createEditCampusSchema
>;
