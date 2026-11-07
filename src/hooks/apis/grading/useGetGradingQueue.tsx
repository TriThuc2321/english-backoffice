import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetGradingQueueParams } from '@/types/grading';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { gradingApi } from '@/services/apis';

const useGetGradingQueue = (params: GetGradingQueueParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.GRADING.QUEUE, params],
    queryFn: () => gradingApi.getQueue(params),
    placeholderData: keepPreviousData,
  });

export default useGetGradingQueue;
