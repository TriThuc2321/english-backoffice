import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { userApi } from '@/services/apis';

const useEditUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: userApi.edit,
    onSuccess: () => {
      toast.success(t('cmsUsers.toast.updateSuccess'));

      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CMS_USER.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CMS_USER.BY_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('cmsUsers.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditUser;
