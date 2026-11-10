import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/services/apis';

const useForgotPassword = () =>
  useMutation({ mutationFn: authApi.forgotPassword });

export default useForgotPassword;
