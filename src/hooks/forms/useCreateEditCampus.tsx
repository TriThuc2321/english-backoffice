import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver } from 'react-hook-form';

import type { CreateEditCampusFormData } from '@/schemas/campus';

import { createEditCampusSchema } from '@/schemas/campus';

interface IUseCreateEditCampusForm {
  defaultValues?: Partial<CreateEditCampusFormData>;
}

const useCreateEditCampusForm = (
  prop: IUseCreateEditCampusForm = { defaultValues: undefined },
) =>
  useForm<CreateEditCampusFormData>({
    resolver: yupResolver(
      createEditCampusSchema,
    ) as Resolver<CreateEditCampusFormData>,
    defaultValues: prop.defaultValues,
  });

export default useCreateEditCampusForm;
