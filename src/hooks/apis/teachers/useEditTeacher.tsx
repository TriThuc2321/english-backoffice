import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { teacherApi } from '@/services/apis';

const useEditTeacher = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: teacherApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('teachers.toast.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEACHER.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEACHER.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('teachers.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditTeacher;
