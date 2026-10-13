import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { TestSectionFormData, TestSectionFormInput } from '@/schemas/test';

import { testSectionSchema } from '@/schemas/test';

interface IUseEditTestSectionForm {
  defaultValues?: Partial<TestSectionFormData>;
}
const useEditTestSectionForm = (
  prop: IUseEditTestSectionForm = { defaultValues: undefined },
) =>
  useForm<TestSectionFormInput, unknown, TestSectionFormData>({
    resolver: yupResolver(testSectionSchema),
    defaultValues: prop.defaultValues,
  });

export default useEditTestSectionForm;
