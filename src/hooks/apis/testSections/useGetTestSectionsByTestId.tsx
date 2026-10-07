import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useGetTestSectionsByTestId = (testId: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_SECTION.BY_TEST_ID, testId],
    queryFn: () => testSectionApi.getByTestId(testId),
  });

export default useGetTestSectionsByTestId;
