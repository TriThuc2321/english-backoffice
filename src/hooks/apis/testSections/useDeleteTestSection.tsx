import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useDeleteTestSection = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testSectionApi.delete,
    onSuccess: () => {
      toast.success(t('tests.toast.sectionDeleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_SECTION.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_SECTION.BY_TEST_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.sectionDeleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteTestSection;
