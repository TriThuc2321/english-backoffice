import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/services/apis';
import { endSession } from '@/services/axios-instance';

const useLogout = () =>
  useMutation({
    mutationFn: authApi.logout,
    onSettled: () => endSession({ broadcast: true }),
  });

export default useLogout;
