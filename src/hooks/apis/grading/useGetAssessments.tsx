import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { gradingApi } from '@/services/apis';

const useGetAssessments = (id?: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.GRADING.ASSESSMENTS, id],
    queryFn: () => gradingApi.getAssessments(id!),
    enabled: !!id,
  });

export default useGetAssessments;
