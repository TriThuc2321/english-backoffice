import * as yup from 'yup';

import { RoleStatus } from '@/types/role';

import { VALIDATION_MESSAGE } from './message';

export const createEditRoleSchema = yup.object().shape({
  name: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  code: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  status: yup
    .mixed<RoleStatus>()
    .oneOf(Object.values(RoleStatus))
    .required(VALIDATION_MESSAGE.REQUIRED),
  canAccessCms: yup.boolean().required(VALIDATION_MESSAGE.REQUIRED),
  permissionIds: yup
    .array()
    .of(yup.number().required(VALIDATION_MESSAGE.REQUIRED))
    .defined(),
});

export type CreateEditRoleFormData = yup.InferType<typeof createEditRoleSchema>;
