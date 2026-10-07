import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { programApi } from '@/services/apis';

const useEditProgram = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: programApi.edit,
    onSuccess: (_, { id }) => {
      toast.success(t('programs.toast.updateSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PROGRAM.BY_ID, id],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PROGRAM.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('programs.toast.updateError'), {
        description: err.message,
      });
    },
  });
};

export default useEditProgram;
