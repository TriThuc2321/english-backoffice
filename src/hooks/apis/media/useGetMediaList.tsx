import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetMediaParams } from '@/types/media';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';

// Pickers wait for an owner; the library page lists everything
const useGetMediaList = (
  params: GetMediaParams,
  { enabled = !!params.ownerId }: { enabled?: boolean } = {},
) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.MEDIA.LIST, params],
    queryFn: () => mediaApi.getAll(params),
    enabled,
    placeholderData: keepPreviousData,
  });

export default useGetMediaList;
