import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type { EditMediaFormData, EditMediaFormInput } from '@/schemas/media';

import { editMediaSchema } from '@/schemas/media';

interface IUseEditMediaForm {
  defaultValues?: Partial<EditMediaFormData>;
}
const useEditMediaForm = (
  prop: IUseEditMediaForm = { defaultValues: undefined },
) =>
  useForm<EditMediaFormInput, unknown, EditMediaFormData>({
    resolver: yupResolver(editMediaSchema),
    defaultValues: prop.defaultValues,
  });

export default useEditMediaForm;
