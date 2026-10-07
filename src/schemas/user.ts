import * as yup from 'yup';

import { Gender } from '@/types/common';

import { VALIDATION_MESSAGE } from './message';

export const createEditUserSchema = yup.object().shape({
  email: yup
    .string()
    .email(VALIDATION_MESSAGE.INVALID_EMAIL)
    .required(VALIDATION_MESSAGE.REQUIRED),
  firstName: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  lastName: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  avatar: yup
    .string()
    .transform((v) => v || undefined)
    .optional(),
  roleId: yup.number().required(VALIDATION_MESSAGE.REQUIRED),
  phone: yup
    .string()
    .transform((v) => v || undefined)
    .optional(),
  dateOfBirth: yup
    .string()
    .transform((v) => v || undefined)
    .test('is-past', VALIDATION_MESSAGE.MUST_BE_PAST_DATE, (value) => {
      if (!value) return true;
      return new Date(value) < new Date();
    })
    .optional(),
  gender: yup.mixed<Gender>().oneOf(Object.values(Gender)).optional(),
  address: yup
    .string()
    .transform((v) => v || undefined)
    .optional(),
});

export type CreateEditUserFormData = yup.InferType<typeof createEditUserSchema>;
