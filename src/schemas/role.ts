import * as yup from 'yup';

import type { EditableStatus } from '@/types/common';

import { Status } from '@/types/common';

import type { InferFormInput } from './types';

import { VALIDATION_MESSAGE } from './message';

export const createEditRoleSchema = yup.object().shape({
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  code: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  status: yup
    .mixed<EditableStatus>()
    .oneOf([Status.ACTIVE, Status.INACTIVE])
    .optional(),
  canAccessCms: yup.boolean().required(VALIDATION_MESSAGE.REQUIRED),
  permissionIds: yup
    .array()
    .of(yup.number().required(VALIDATION_MESSAGE.REQUIRED))
    .defined(),
});

export type CreateEditRoleFormInput = InferFormInput<
  typeof createEditRoleSchema
>;
export type CreateEditRoleFormData = yup.InferType<typeof createEditRoleSchema>;
