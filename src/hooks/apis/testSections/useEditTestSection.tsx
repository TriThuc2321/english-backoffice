import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useEditTestSection = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testSectionApi.edit,
    onSuccess: () => {
      toast.success(t('tests.toast.sectionUpdateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_SECTION.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_SECTION.BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_SECTION.BY_TEST_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.sectionUpdateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditTestSection;
