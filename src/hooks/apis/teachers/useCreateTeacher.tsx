import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { teacherApi } from '@/services/apis';

const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: teacherApi.create,
    onSuccess: () => {
      toast.success(t('teachers.toast.createSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEACHER.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('teachers.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateTeacher;
