import { useMutation } from '@tanstack/react-query';

import { LOGIN_PATH } from '@/constants/auth';
import { getQueryClient } from '@/providers';
import { authApi } from '@/services/apis';
import { clearAccessToken } from '@/services/auth-token';

const useLogout = () =>
  useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAccessToken();
      getQueryClient().clear();
      window.location.assign(LOGIN_PATH);
    },
  });

export default useLogout;
