import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useCreateQuestionGroup = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: questionGroupApi.create,
    onSuccess: () => {
      toast.success(t('tests.toast.groupCreateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.groupCreateError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateQuestionGroup;
