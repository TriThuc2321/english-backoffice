import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testPartApi } from '@/services/apis';

const useReorderTestParts = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testPartApi.reorder,
    onSuccess: (data, { sectionId }) => {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.TEST_PART.LIST, sectionId],
        data,
      );
      toast.success(t('tests.toast.reorderSuccess'));
    },
    onError: (err) => {
      toast.danger(t('tests.toast.reorderError'), {
        description: err.message,
      });
    },
  });
};

export default useReorderTestParts;
