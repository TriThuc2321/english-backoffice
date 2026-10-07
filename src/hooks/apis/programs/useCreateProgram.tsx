import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { programApi } from '@/services/apis';

const useCreateProgram = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: programApi.create,
    onSuccess: () => {
      toast.success(t('programs.toast.createSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PROGRAM.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('programs.toast.createError'), {
        description: err.message,
      });
    },
  });
};

export default useCreateProgram;
