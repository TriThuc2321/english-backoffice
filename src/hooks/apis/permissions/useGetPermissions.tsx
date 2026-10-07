import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { permissionApi } from '@/services/apis';

const useGetPermissions = () =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.PERMISSION.LIST],
    queryFn: permissionApi.getAll,
  });

export default useGetPermissions;
