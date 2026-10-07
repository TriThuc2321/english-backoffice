import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { userApi } from '@/services/apis';

const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      toast.success(t('cmsUsers.toast.deleteSuccess'));

      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CMS_USER.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('cmsUsers.toast.deleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteUser;
