import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import type { Params } from '@/types/common';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { passageApi } from '@/services/apis';

const useGetPassagesInfinity = (params: Params) =>
  useInfiniteQuery({
    queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST_INFINITE, params],
    queryFn: ({ pageParam }) =>
      passageApi.getAll({ ...params, page: pageParam, take: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta) {
        const { page, totalCount, take } = lastPage.meta;
        if (page! < totalCount! / take!) return page! + 1;

        return undefined;
      }

      return undefined;
    },
    select: (resData) => resData.pages.flatMap((page) => page.data),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });

export default useGetPassagesInfinity;
