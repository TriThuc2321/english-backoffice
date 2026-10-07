import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { studentApi } from '@/services/apis';

const useEditStudent = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: studentApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('students.toast.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.STUDENT.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.STUDENT.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('students.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditStudent;
