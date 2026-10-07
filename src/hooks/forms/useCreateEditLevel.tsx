import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver } from 'react-hook-form';

import type { CreateEditLevelFormData } from '@/schemas/level';

import { createEditLevelSchema } from '@/schemas/level';

interface IUseCreateEditLevelForm {
  defaultValues?: Partial<CreateEditLevelFormData>;
}

const useCreateEditLevelForm = (
  prop: IUseCreateEditLevelForm = { defaultValues: undefined },
) =>
  useForm<CreateEditLevelFormData>({
    resolver: yupResolver(
      createEditLevelSchema,
    ) as Resolver<CreateEditLevelFormData>,
    defaultValues: prop.defaultValues,
  });

export default useCreateEditLevelForm;
