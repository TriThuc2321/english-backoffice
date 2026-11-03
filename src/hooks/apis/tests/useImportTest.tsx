import { useMutation, useQueryClient } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testApi } from '@/services/apis';

const useImportTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: testApi.import,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.TEST.LIST_INFINITE],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST_INFINITE],
      });
    },
  });
};

export default useImportTest;
