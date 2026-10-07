import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useGetTestSectionsByIds = (ids: string[]) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_SECTION.BY_IDS, ids],
    queryFn: () => testSectionApi.getByIds(ids),
    enabled: ids.length > 0,
  });

export default useGetTestSectionsByIds;
