import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '@/schemas/auth';

const useResetPasswordForm = (defaultValues?: Partial<ResetPasswordFormData>) =>
  useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues,
  });

export default useResetPasswordForm;
