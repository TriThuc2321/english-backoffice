import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { levelApi } from '@/services/apis';

const useDeleteLevel = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: levelApi.delete,
    onSuccess: () => {
      toast.success(t('levels.toast.deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.LEVEL.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('levels.toast.deleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteLevel;
