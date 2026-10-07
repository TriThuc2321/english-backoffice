import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { questionGroupApi } from '@/services/apis';

const useGetQuestionGroupById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.QUESTION_GROUP.BY_ID, id],
    queryFn: () => questionGroupApi.getById(id),
    enabled: !!id,
  });

export default useGetQuestionGroupById;
