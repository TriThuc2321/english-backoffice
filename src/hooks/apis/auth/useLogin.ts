import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/services/apis';
import { setAccessToken } from '@/services/auth-token';

const useLogin = () =>
  useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ access_token }) => setAccessToken(access_token),
  });

export default useLogin;
