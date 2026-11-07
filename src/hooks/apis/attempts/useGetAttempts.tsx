import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetAttemptsParams } from '@/types/attempt';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { attemptApi } from '@/services/apis';

const useGetAttempts = (params: GetAttemptsParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ATTEMPT.LIST, params],
    queryFn: () => attemptApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetAttempts;
