import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testPartApi } from '@/services/apis';

const useGetTestParts = (sectionId?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_PART.LIST, sectionId],
    queryFn: () => testPartApi.getAll(sectionId!),
    enabled: !!sectionId,
  });

export default useGetTestParts;
