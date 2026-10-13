import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useGetTestSections = (testId?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_SECTION.LIST, testId],
    queryFn: () => testSectionApi.getAll(testId!),
    enabled: !!testId,
  });

export default useGetTestSections;
