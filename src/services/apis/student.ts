import type { Message } from '@/types/common';
import type {
  CreateStudentPayload,
  EditStudentPayload,
  GetStudentsParams,
  GetStudentsResponse,
  Student,
} from '@/types/student';

import axiosInstance from '@/services/axios-instance';

const studentApi = {
  getAll: (params: GetStudentsParams): Promise<GetStudentsResponse> =>
    axiosInstance.get('/students', { params }),
  getById: (id: string): Promise<Student> =>
    axiosInstance.get(`/students/${id}`),
  create: (payload: CreateStudentPayload): Promise<Student> =>
    axiosInstance.post('/students', payload),
  edit: ({ id, ...payload }: EditStudentPayload): Promise<Student> =>
    axiosInstance.patch(`/students/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/students', { data: { ids } }),
};

export default studentApi;
