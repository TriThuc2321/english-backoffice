import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testPartApi } from '@/services/apis';

const useGetTestPartById = (id?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST_PART.BY_ID, id],
    queryFn: () => testPartApi.getById(id!),
    enabled: !!id,
  });

export default useGetTestPartById;
