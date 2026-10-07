import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { roleApi } from '@/services/apis';

const useGetRoleById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ROLE.BY_ID, id],
    queryFn: () => roleApi.getById(id),
  });

export default useGetRoleById;
