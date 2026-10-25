import * as yup from 'yup';

import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

import type { InferFormInput } from './types';

import { VALIDATION_MESSAGE } from './message';

export const uploadMediaSchema = yup.object().shape({
  scope: yup
    .mixed<MediaScope>()
    .oneOf(Object.values(MediaScope))
    .required(VALIDATION_MESSAGE.REQUIRED),
  ownerId: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  kind: yup
    .mixed<MediaKind>()
    .oneOf(Object.values(MediaKind))
    .required(VALIDATION_MESSAGE.REQUIRED),
  file: yup.mixed<File>().required(VALIDATION_MESSAGE.REQUIRED),
});

export type UploadMediaFormInput = InferFormInput<typeof uploadMediaSchema>;
export type UploadMediaFormData = yup.InferType<typeof uploadMediaSchema>;

export const editMediaSchema = yup.object().shape({
  durationMs: yup.number().integer().min(0).optional(),
  transcript: yup.string().defined(),
});

export type EditMediaFormInput = InferFormInput<typeof editMediaSchema>;
export type EditMediaFormData = yup.InferType<typeof editMediaSchema>;
