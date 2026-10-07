import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { studentApi } from '@/services/apis';

const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: studentApi.create,
    onSuccess: () => {
      toast.success(t('students.toast.createSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.STUDENT.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('students.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateStudent;
