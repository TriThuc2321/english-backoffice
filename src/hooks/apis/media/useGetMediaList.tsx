import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetMediaParams } from '@/types/media';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';

const useGetMediaList = (params: GetMediaParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.MEDIA.LIST, params],
    queryFn: () => mediaApi.getAll(params),
    enabled: !!params.testId,
    placeholderData: keepPreviousData,
  });

export default useGetMediaList;
