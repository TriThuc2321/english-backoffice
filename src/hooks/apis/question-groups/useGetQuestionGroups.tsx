import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useGetQuestionGroups = (partId?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST, partId],
    queryFn: () => questionGroupApi.getAll(partId!),
    enabled: !!partId,
  });

export default useGetQuestionGroups;
