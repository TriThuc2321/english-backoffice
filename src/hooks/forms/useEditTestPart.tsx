import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { TestPartFormData, TestPartFormInput } from '@/schemas/test';

import { testPartSchema } from '@/schemas/test';

interface IUseEditTestPartForm {
  defaultValues?: Partial<TestPartFormData>;
}
const useEditTestPartForm = (
  prop: IUseEditTestPartForm = { defaultValues: undefined },
) =>
  useForm<TestPartFormInput, unknown, TestPartFormData>({
    resolver: yupResolver(testPartSchema),
    defaultValues: prop.defaultValues,
  });

export default useEditTestPartForm;
