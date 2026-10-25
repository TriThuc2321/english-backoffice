import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionApi } from '@/services/apis';

const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: questionApi.create,
    onSuccess: () => {
      toast.success(t('tests.toast.questionCreateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.questionCreateError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateQuestion;
