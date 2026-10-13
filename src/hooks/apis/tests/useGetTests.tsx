import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetTestsParams } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testApi } from '@/services/apis';

const useGetTests = (params: GetTestsParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST.LIST, params],
    queryFn: () => testApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetTests;
