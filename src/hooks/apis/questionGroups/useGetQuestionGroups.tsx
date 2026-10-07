import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetQuestionGroupParams } from '@/types/test';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useGetQuestionGroups = (params: GetQuestionGroupParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.LIST, params],
    queryFn: () => questionGroupApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetQuestionGroups;
