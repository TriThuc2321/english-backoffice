import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetProgramsParams } from '@/types/program';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { programApi } from '@/services/apis';

const useGetPrograms = (params: GetProgramsParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.PROGRAM.LIST, params],
    queryFn: () => programApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetPrograms;
