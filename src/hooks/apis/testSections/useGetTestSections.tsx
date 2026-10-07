import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetTestSectionParams } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useGetTestSections = (params: GetTestSectionParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_SECTION.LIST, params],
    queryFn: () => testSectionApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetTestSections;
