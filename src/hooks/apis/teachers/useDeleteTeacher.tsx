import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { teacherApi } from '@/services/apis';

const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: teacherApi.delete,
    onSuccess: () => {
      toast.success(t('teachers.toast.deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEACHER.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('teachers.toast.deleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteTeacher;
