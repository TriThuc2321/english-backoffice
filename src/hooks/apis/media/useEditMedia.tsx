import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';

const useEditMedia = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: mediaApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('tests.toast.mediaUpdateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.MEDIA.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.MEDIA.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.mediaUpdateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditMedia;
