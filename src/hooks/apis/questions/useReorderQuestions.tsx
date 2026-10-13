import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionApi } from '@/services/apis';

const useReorderQuestions = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: questionApi.reorder,
    onSuccess: (data, { groupId }) => {
      queryClient.setQueryData([REACT_QUERY_KEYS.QUESTION.LIST, groupId], data);
      toast.success(t('tests.toast.reorderSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.reorderError'), {
        description: err.message,
      });
    },
  });
};

export default useReorderQuestions;
