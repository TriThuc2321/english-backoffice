import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { passageApi } from '@/services/apis';

const useDeletePassage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: passageApi.delete,
    onSuccess: () => {
      toast.success(t('passages.toast.deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('passages.toast.deleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeletePassage;
