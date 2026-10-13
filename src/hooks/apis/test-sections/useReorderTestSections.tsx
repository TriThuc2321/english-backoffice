import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useReorderTestSections = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testSectionApi.reorder,
    onSuccess: (data, { testId }) => {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.TEST_SECTION.LIST, testId],
        data,
      );
      toast.success(t('tests.toast.reorderSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST.BY_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.reorderError'), {
        description: err.message,
      });
    },
  });
};

export default useReorderTestSections;
