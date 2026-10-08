import * as yup from 'yup';

import type { EditablePassageStatus } from '@/types/passage';

import { MarkedBy } from '@/types/common';
import { PassageStatus } from '@/types/passage';

import type { InferFormInput } from './types';

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
    .mixed<EditablePassageStatus>()
    .oneOf([PassageStatus.PUBLISHED, PassageStatus.DRAFT])
    .optional(),
  paragraphs: yup
    .array()
    .of(
      yup.object().shape({
        content: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
      }),
    )
    .defined(),
});

export type CreateEditPassageFormInput = InferFormInput<
  typeof createEditPassageSchema
>;
export type CreateEditPassageFormData = yup.InferType<
  typeof createEditPassageSchema
>;
