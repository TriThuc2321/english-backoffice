import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type {
  UploadMediaFormData,
  UploadMediaFormInput,
} from '@/schemas/media';

import { uploadMediaSchema } from '@/schemas/media';

interface IUseUploadMediaForm {
  defaultValues?: Partial<UploadMediaFormData>;
}
const useUploadMediaForm = (
  prop: IUseUploadMediaForm = { defaultValues: undefined },
) =>
  useForm<UploadMediaFormInput, unknown, UploadMediaFormData>({
    resolver: yupResolver(uploadMediaSchema),
    defaultValues: prop.defaultValues,
  });

export default useUploadMediaForm;
