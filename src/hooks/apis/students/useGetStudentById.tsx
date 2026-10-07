import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { studentApi } from '@/services/apis';

const useGetStudentById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.STUDENT.BY_ID, id],
    queryFn: () => studentApi.getById(id),
    enabled: !!id,
  });

export default useGetStudentById;
