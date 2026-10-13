import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testPartApi } from '@/services/apis';

const useEditTestPart = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: testPartApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('tests.toast.partUpdateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_PART.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST_PART.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.partUpdateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditTestPart;
