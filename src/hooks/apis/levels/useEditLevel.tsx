import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { levelApi } from '@/services/apis';

const useEditLevel = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: levelApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('levels.toast.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.LEVEL.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.LEVEL.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('levels.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditLevel;
