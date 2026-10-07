import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { roleApi } from '@/services/apis';

const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: roleApi.create,
    onSuccess: () => {
      toast.success(t('roles.toast.createSuccess'));

      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROLE.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('roles.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateRole;
