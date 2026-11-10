import * as yup from 'yup';

import { VALIDATION_MESSAGE } from './message';

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

const email = yup
  .string()
  .trim()
  .required(VALIDATION_MESSAGE.REQUIRED)
  .email(VALIDATION_MESSAGE.INVALID_EMAIL);

export const loginSchema = yup.object({
  email,
  password: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
});

export const forgotPasswordSchema = yup.object({ email });

export const resetPasswordSchema = yup.object({
  code: yup
    .string()
    .trim()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .matches(/^\d{6}$/, VALIDATION_MESSAGE.CODE_INVALID),
  newPassword: yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .min(PASSWORD_MIN, VALIDATION_MESSAGE.PASSWORD_LENGTH)
    .max(PASSWORD_MAX, VALIDATION_MESSAGE.PASSWORD_LENGTH),
  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGE.REQUIRED)
    .oneOf([yup.ref('newPassword')], VALIDATION_MESSAGE.PASSWORD_NOT_MATCH),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
