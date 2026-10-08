import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type {
  CreateEditRoleFormData,
  CreateEditRoleFormInput,
} from '@/schemas/role';

import { createEditRoleSchema } from '@/schemas/role';

interface UseCreateEditRoleFormOptions {
  defaultValues?: Partial<CreateEditRoleFormData>;
}

const useCreateEditRoleForm = (prop: UseCreateEditRoleFormOptions = {}) =>
  useForm<CreateEditRoleFormInput, unknown, CreateEditRoleFormData>({
    resolver: yupResolver(createEditRoleSchema),
    defaultValues: prop.defaultValues,
  });

export default useCreateEditRoleForm;
