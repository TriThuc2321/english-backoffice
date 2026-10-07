import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver } from 'react-hook-form';

import type { CreateEditUserFormData } from '@/schemas/user';

import { createEditUserSchema } from '@/schemas/user';

interface UseCreateEditUserFormOptions {
  defaultValues?: Partial<CreateEditUserFormData>;
}

const useCreateEditUserForm = (prop: UseCreateEditUserFormOptions = {}) =>
  useForm<CreateEditUserFormData>({
    resolver: yupResolver(
      createEditUserSchema,
    ) as Resolver<CreateEditUserFormData>,
    defaultValues: prop.defaultValues,
  });

export default useCreateEditUserForm;
