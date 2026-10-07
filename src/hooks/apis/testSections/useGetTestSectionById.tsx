import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testSectionApi } from '@/services/apis';

const useGetTestSectionById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_SECTION.BY_ID, id],
    queryFn: () => testSectionApi.getById(id),
  });

export default useGetTestSectionById;
