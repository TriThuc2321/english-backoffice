import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetLevelsParams } from '@/types/level';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { levelApi } from '@/services/apis';

const useGetLevels = (params: GetLevelsParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.LEVEL.LIST, params],
    queryFn: () => levelApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetLevels;
