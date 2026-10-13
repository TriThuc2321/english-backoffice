import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testPartApi } from '@/services/apis';

const useDeleteTestPart = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testPartApi.delete,
    onSuccess: () => {
      toast.success(t('tests.toast.partDeleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_PART.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.partDeleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteTestPart;
