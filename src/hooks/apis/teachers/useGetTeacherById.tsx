import { useQuery } from '@tanstack/react-query';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { teacherApi } from '@/services/apis';

const useGetTeacherById = (id: string) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEACHER.BY_ID, id],
    queryFn: () => teacherApi.getById(id),
    enabled: !!id,
  });

export default useGetTeacherById;
