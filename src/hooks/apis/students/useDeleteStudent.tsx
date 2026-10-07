import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { studentApi } from '@/services/apis';

const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      toast.success(t('students.toast.deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.STUDENT.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('students.toast.deleteError'), {
        description: err.message,
      });
    },
  });
};

export default useDeleteStudent;
