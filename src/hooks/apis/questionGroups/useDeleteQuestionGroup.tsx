import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useDeleteQuestionGroup = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: questionGroupApi.delete,
    onSuccess: () => {
      toast.success(t('tests.toast.groupDeleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_TEST_SECTION_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.groupDeleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteQuestionGroup;
