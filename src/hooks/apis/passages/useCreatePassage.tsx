import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { passageApi } from '@/services/apis';

const useCreatePassage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: passageApi.create,
    onSuccess: () => {
      toast.success(t('passages.toast.createSuccess'));

      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('passages.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreatePassage;
