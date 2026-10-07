import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetPassageParams } from '@/types/passage';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { passageApi } from '@/services/apis';

const useGetPassages = (params: GetPassageParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST, params],
    queryFn: () => passageApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetPassages;
