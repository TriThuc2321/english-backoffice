import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { levelApi } from '@/services/apis';

const useGetLevelById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.LEVEL.BY_ID, id],
    queryFn: () => levelApi.getById(id),
    enabled: !!id,
  });

export default useGetLevelById;
