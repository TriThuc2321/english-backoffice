import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { EditTestFormData, EditTestFormInput } from '@/schemas/test';

import { editTestSchema } from '@/schemas/test';

interface IUseEditTestForm {
  defaultValues?: Partial<EditTestFormData>;
}
const useEditTestForm = (
  prop: IUseEditTestForm = { defaultValues: undefined },
) =>
  useForm<EditTestFormInput, unknown, EditTestFormData>({
    resolver: yupResolver(editTestSchema),
    defaultValues: prop.defaultValues,
  });

export default useEditTestForm;
