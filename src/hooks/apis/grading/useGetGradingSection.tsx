import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { gradingApi } from '@/services/apis';

const useGetGradingSection = (id?: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.GRADING.SECTION, id],
    queryFn: () => gradingApi.getSection(id!),
    enabled: !!id,
  });

export default useGetGradingSection;
