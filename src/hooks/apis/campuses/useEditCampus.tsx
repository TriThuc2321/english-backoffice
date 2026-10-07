import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { campusApi } from '@/services/apis';

const useEditCampus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: campusApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('campuses.toast.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CAMPUS.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CAMPUS.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('campuses.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditCampus;
