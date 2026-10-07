import { toast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/services/apis';

const useLogout = () =>
  useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      window.location.reload();
    },
    onError: (err) => {
      toast.danger('Logout failed', {
        description: err.message,
        timeout: 3000,
      });
    },
  });

export default useLogout;
