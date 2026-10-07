import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { CreateEditTeacherFormData } from '@/schemas/teacher';

import { createEditTeacherSchema } from '@/schemas/teacher';

interface IUseCreateEditTeacherForm {
  defaultValues?: Partial<CreateEditTeacherFormData>;
}

const useCreateEditTeacherForm = (
  prop: IUseCreateEditTeacherForm = { defaultValues: undefined },
) =>
  useForm<CreateEditTeacherFormData>({
    resolver: yupResolver(createEditTeacherSchema),
    defaultValues: prop.defaultValues,
  });

export default useCreateEditTeacherForm;
