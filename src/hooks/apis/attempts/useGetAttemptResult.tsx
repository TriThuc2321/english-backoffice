import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { attemptApi } from '@/services/apis';

const useGetAttemptResult = (id?: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ATTEMPT.RESULT, id],
    queryFn: () => attemptApi.getResult(id!),
    enabled: !!id,
  });

export default useGetAttemptResult;
