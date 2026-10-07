import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { testApi } from '@/services/apis';

const useGetTestById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEST.BY_ID, id],
    queryFn: () => testApi.getById(id),
    enabled: !!id,
  });

export default useGetTestById;
