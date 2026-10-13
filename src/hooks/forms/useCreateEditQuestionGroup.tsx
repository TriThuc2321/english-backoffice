import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import type {
  QuestionGroupFormData,
  QuestionGroupFormInput,
} from '@/schemas/test';

import { questionGroupSchema } from '@/schemas/test';

interface IUseCreateEditQuestionGroupForm {
  defaultValues?: Partial<QuestionGroupFormData>;
}
const useCreateEditQuestionGroupForm = (
  prop: IUseCreateEditQuestionGroupForm = { defaultValues: undefined },
) =>
  useForm<QuestionGroupFormInput, unknown, QuestionGroupFormData>({
    resolver: yupResolver(questionGroupSchema),
    defaultValues: prop.defaultValues,
  });

export default useCreateEditQuestionGroupForm;
