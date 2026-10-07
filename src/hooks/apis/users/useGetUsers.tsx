import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetUsersParams } from '@/types/user';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { userApi } from '@/services/apis';

const useGetUsers = (params: GetUsersParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.CMS_USER.LIST, params],
    queryFn: () => userApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetUsers;
