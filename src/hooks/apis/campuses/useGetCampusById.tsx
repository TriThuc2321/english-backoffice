import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { campusApi } from '@/services/apis';

const useGetCampusById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.CAMPUS.BY_ID, id],
    queryFn: () => campusApi.getById(id),
    enabled: !!id,
  });

export default useGetCampusById;
