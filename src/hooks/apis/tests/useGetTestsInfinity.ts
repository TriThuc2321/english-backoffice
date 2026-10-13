import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import type { GetTestsParams } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testApi } from '@/services/apis';

const useGetTestsInfinity = (params: GetTestsParams) =>
  useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.TEST.LIST_INFINITE, params],
    queryFn: ({ pageParam }) =>
      testApi.getAll({ ...params, page: pageParam, take: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta) {
        const { page, totalCount, take } = lastPage.meta;
        if (page! < totalCount! / take!) return page! + 1;

        return undefined;
      }

      return undefined;
    },
    select: (resData) => resData.pages.flatMap((page) => page.data ?? []),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });

export default useGetTestsInfinity;
