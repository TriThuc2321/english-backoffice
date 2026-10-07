import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { passageApi } from '@/services/apis';

const useEditPassage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: passageApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('passages.toast.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PASSAGE.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('passages.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditPassage;
