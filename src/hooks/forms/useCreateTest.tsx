import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { CreateTestFormData, CreateTestFormInput } from '@/schemas/test';

import { createTestSchema } from '@/schemas/test';

interface IUseCreateTestForm {
  defaultValues?: Partial<CreateTestFormData>;
}
const useCreateTestForm = (
  prop: IUseCreateTestForm = { defaultValues: undefined },
) =>
  useForm<CreateTestFormInput, unknown, CreateTestFormData>({
    resolver: yupResolver(createTestSchema),
    defaultValues: prop.defaultValues,
  });

export default useCreateTestForm;
