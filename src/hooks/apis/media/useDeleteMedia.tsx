import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';

const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: mediaApi.delete,
    onSuccess: (_, id) => {
      toast.success(t('tests.toast.mediaDeleteSuccess'));
      queryClient.removeQueries({
        queryKey: [REACT_QUERY_KEYS.MEDIA.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.MEDIA.LIST],
      });
    },
    // 409 when the media is still attached to a part/group/question
    onError: (err) => {
      toast.danger(t('tests.toast.mediaDeleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteMedia;
