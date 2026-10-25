import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';

const useGetMediaById = (id?: number) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.MEDIA.BY_ID, id],
    queryFn: () => mediaApi.getById(id!),
    enabled: !!id,
  });

export default useGetMediaById;
