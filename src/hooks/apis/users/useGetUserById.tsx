import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { userApi } from '@/services/apis';

const useGetUserById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.CMS_USER.BY_ID, id],
    queryFn: () => userApi.getById(id),
  });

export default useGetUserById;
