import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { CreateEditPassageFormData } from '@/schemas/passage';

import { createEditPassageSchema } from '@/schemas/passage';

interface IUseCreateEditPassageForm {
  defaultValues?: Partial<CreateEditPassageFormData>;
}
const useCreateEditPassageForm = (
  prop: IUseCreateEditPassageForm = { defaultValues: undefined },
) =>
  useForm<CreateEditPassageFormData>({
    resolver: yupResolver(createEditPassageSchema),
    defaultValues: prop.defaultValues,
  });

export default useCreateEditPassageForm;
