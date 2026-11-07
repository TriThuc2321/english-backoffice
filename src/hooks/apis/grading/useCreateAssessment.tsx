import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { ApiError } from '@/types/common';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { gradingApi } from '@/services/apis';
import { ASSESSMENT_ERROR } from '@/types/grading';

const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const refreshSection = (id: string) => {
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.GRADING.SECTION, id],
    });
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.GRADING.ASSESSMENTS, id],
    });
  };

  return useMutation({
    mutationFn: gradingApi.createAssessment,
    onSuccess: (_, { id }) => {
      toast.success(t('grading.toast.saveSuccess'));
      refreshSection(id);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GRADING.QUEUE],
      });
    },
    onError: (err: ApiError, { id }) => {
      if (err?.code === ASSESSMENT_ERROR.REVISION_CONFLICT) {
        toast.danger(t('grading.toast.conflict'));
        refreshSection(id);
        return;
      }
      if (err?.code === ASSESSMENT_ERROR.NOT_GRADABLE) {
        toast.danger(t('grading.toast.notGradable'));
        return;
      }
      const { message } = err ?? {};
      toast.danger(t('grading.toast.saveError'), {
        description: Array.isArray(message) ? message.join('; ') : message,
      });
    },
  });
};

export default useCreateAssessment;
