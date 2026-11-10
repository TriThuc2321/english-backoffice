import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from '@/schemas/auth';

const useForgotPasswordForm = (
  defaultValues?: Partial<ForgotPasswordFormData>,
) =>
  useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues,
  });

export default useForgotPasswordForm;
