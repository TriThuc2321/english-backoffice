import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { campusApi } from '@/services/apis';

const useCreateCampus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: campusApi.create,
    onSuccess: () => {
      toast.success(t('campuses.toast.createSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.CAMPUS.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('campuses.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateCampus;
