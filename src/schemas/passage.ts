import * as yup from 'yup';

import { MarkedBy, Status } from '@/types/common';

import { VALIDATION_MESSAGE } from './message';

export const createEditPassageSchema = yup.object().shape({
  title: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  subtitle: yup.string().defined(),
  markedBy: yup
    .string()
    .oneOf(Object.values(MarkedBy))
    .default(MarkedBy.NONE)
    .required(VALIDATION_MESSAGE.REQUIRED),
  status: yup
    .string()
    .oneOf(Object.values(Status))
    .required(VALIDATION_MESSAGE.REQUIRED),
  paragraphs: yup
    .array()
    .of(
      yup.object().shape({
        content: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
      }),
    )
    .defined(),
});

export type CreateEditPassageFormData = yup.InferType<
  typeof createEditPassageSchema
>;
