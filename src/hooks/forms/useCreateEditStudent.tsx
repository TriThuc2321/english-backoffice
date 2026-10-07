import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, type Resolver } from 'react-hook-form';

import type { CreateEditStudentFormData } from '@/schemas/student';

import { createEditStudentSchema } from '@/schemas/student';

interface IUseCreateEditStudentForm {
  defaultValues?: Partial<CreateEditStudentFormData>;
}

const useCreateEditStudentForm = (
  prop: IUseCreateEditStudentForm = { defaultValues: undefined },
) =>
  useForm<CreateEditStudentFormData>({
    resolver: yupResolver(
      createEditStudentSchema,
    ) as unknown as Resolver<CreateEditStudentFormData>,
    defaultValues: prop.defaultValues,
  });

export default useCreateEditStudentForm;
