import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetRolesParams } from '@/types/role';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { roleApi } from '@/services/apis';

const useGetRoles = (params: GetRolesParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.ROLE.LIST, params],
    queryFn: () => roleApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetRoles;
