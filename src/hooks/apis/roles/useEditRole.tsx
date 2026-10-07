import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { roleApi } from '@/services/apis';

const useEditRole = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: roleApi.edit,
    onSuccess: () => {
      toast.success(t('roles.toast.updateSuccess'));

      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROLE.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.ROLE.BY_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('roles.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditRole;
