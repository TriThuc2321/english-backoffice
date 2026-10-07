import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useEditQuestionGroup = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: questionGroupApi.edit,
    onSuccess: () => {
      toast.success(t('tests.toast.groupUpdateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_TEST_SECTION_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.groupUpdateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditQuestionGroup;
