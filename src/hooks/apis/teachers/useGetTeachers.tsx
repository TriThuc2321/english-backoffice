import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetTeachersParams } from '@/types/teacher';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { teacherApi } from '@/services/apis';

const useGetTeachers = (params: GetTeachersParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.TEACHER.LIST, params],
    queryFn: () => teacherApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetTeachers;
