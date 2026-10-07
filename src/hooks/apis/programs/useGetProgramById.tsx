import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { programApi } from '@/services/apis';

const useGetProgramById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.PROGRAM.BY_ID, id],
    queryFn: () => programApi.getById(id),
    enabled: !!id,
  });

export default useGetProgramById;
