import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testPartApi } from '@/services/apis';

const useCreateTestPart = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testPartApi.create,
    onSuccess: () => {
      toast.success(t('tests.toast.partCreateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_PART.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.partCreateError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateTestPart;
