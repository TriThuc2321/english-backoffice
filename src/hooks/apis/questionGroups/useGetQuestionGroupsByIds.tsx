import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useGetQuestionGroupsByIds = (ids: string[]) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_IDS, ids],
    queryFn: () => questionGroupApi.getByIds(ids),
    enabled: !!ids && ids.length > 0,
  });

export default useGetQuestionGroupsByIds;
