import { useQueries } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

// GET /question-groups has no questions, so load each group (shares the by-id cache)
const useGetQuestionGroupsDetail = (ids: number[]) =>
  useQueries({
    queries: ids.map((id) => ({
      queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID, id],
      queryFn: () => questionGroupApi.getById(id),
    })),
  });

export default useGetQuestionGroupsDetail;
