import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetCampusesParams } from '@/types/campus';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { campusApi } from '@/services/apis';

const useGetCampuses = (params: GetCampusesParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.CAMPUS.LIST, params],
    queryFn: () => campusApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetCampuses;
