import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useReorderQuestionGroups = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: questionGroupApi.reorder,
    onSuccess: (data, { partId }) => {
      queryClient.setQueryData(
        [REACT_QUERY_KEYS.QUESTION_GROUP.LIST, partId],
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

export default useReorderQuestionGroups;
