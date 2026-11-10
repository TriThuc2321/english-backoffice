import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { type LoginFormData, loginSchema } from '@/schemas/auth';

const useLoginForm = (defaultValues?: Partial<LoginFormData>) =>
  useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues,
  });

export default useLoginForm;
