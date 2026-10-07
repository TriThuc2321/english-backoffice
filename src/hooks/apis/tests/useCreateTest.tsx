import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testApi } from '@/services/apis';

const useCreateTest = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testApi.create,
    onSuccess: () => {
      toast.success(t('tests.toast.createSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateTest;
