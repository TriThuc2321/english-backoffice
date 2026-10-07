import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver } from 'react-hook-form';

import type { CreateEditProgramFormData } from '@/schemas/program';

import { createEditProgramSchema } from '@/schemas/program';

interface IUseCreateEditProgramForm {
  defaultValues?: Partial<CreateEditProgramFormData>;
}

const useCreateEditProgramForm = (
  prop: IUseCreateEditProgramForm = { defaultValues: undefined },
) =>
  useForm<CreateEditProgramFormData>({
    resolver: yupResolver(
      createEditProgramSchema,
    ) as Resolver<CreateEditProgramFormData>,
    defaultValues: prop.defaultValues,
  });

export default useCreateEditProgramForm;
