import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { GetStudentsParams } from '@/types/student';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { studentApi } from '@/services/apis';

const useGetStudents = (params: GetStudentsParams) =>
  useQuery({
    queryKey: [REACT_QUERY_KEYS.STUDENT.LIST, params],
    queryFn: () => studentApi.getAll(params),
    placeholderData: keepPreviousData,
  });

export default useGetStudents;
