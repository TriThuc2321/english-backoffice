import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionApi } from '@/services/apis';

const useGetQuestionById = (id?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.QUESTION.BY_ID, id],
    queryFn: () => questionApi.getById(id!),
    enabled: !!id,
  });

export default useGetQuestionById;
