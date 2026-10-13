import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionApi } from '@/services/apis';

const useGetQuestions = (groupId?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.QUESTION.LIST, groupId],
    queryFn: () => questionApi.getAll(groupId!),
    enabled: !!groupId,
  });

export default useGetQuestions;
