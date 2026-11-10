import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/services/apis';

const useResetPassword = () =>
  useMutation({ mutationFn: authApi.resetPassword });

export default useResetPassword;
