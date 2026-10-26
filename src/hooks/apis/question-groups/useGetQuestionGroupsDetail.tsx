import type { UseQueryResult } from '@tanstack/react-query';

import { useQueries } from '@tanstack/react-query';

import type { QuestionGroup } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

// Module-level so react-query can memoize the combined result
const combine = (results: UseQueryResult<QuestionGroup>[]) => ({
  data: results.map((r) => r.data).filter((g): g is QuestionGroup => !!g),
  isLoading: results.some((r) => r.isLoading),
});

// GET /question-groups has no questions, so load each group (shares the by-id cache)
const useGetQuestionGroupsDetail = (ids: number[]) =>
  useQueries({
    queries: ids.map((id) => ({
      queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID, id],
      queryFn: () => questionGroupApi.getById(id),
    })),
    combine,
  });

export default useGetQuestionGroupsDetail;
