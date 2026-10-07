import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { passageApi } from '@/services/apis';

const useGetPassageById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.PASSAGE.BY_ID, id],
    queryFn: () => passageApi.getById(id),
    enabled: !!id,
  });

export default useGetPassageById;
