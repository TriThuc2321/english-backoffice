import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { levelApi } from '@/services/apis';

const useCreateLevel = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: levelApi.create,
    onSuccess: () => {
      toast.success(t('levels.toast.createSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.LEVEL.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('levels.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateLevel;
