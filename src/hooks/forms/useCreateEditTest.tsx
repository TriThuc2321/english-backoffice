import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { CreateEditTestFormData } from '@/schemas/test';

import { createEditTestSchema } from '@/schemas/test';

interface IUseCreateEditTestForm {
  defaultValues?: Partial<CreateEditTestFormData>;
}

const useCreateEditTestForm = (
  prop: IUseCreateEditTestForm = { defaultValues: undefined },
) =>
  useForm<CreateEditTestFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(createEditTestSchema) as any,
    defaultValues: prop.defaultValues,
  });

export default useCreateEditTestForm;
