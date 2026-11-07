import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { attemptApi } from '@/services/apis';

const useGetAttemptContent = (id?: string, enabled = true) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ATTEMPT.CONTENT, id],
    queryFn: () => attemptApi.getContent(id!),
    enabled: !!id && enabled,
  });

export default useGetAttemptContent;
