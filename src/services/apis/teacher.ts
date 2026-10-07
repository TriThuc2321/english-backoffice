import type { Message } from '@/types/common';
import type {
  CreateTeacherPayload,
  EditTeacherPayload,
  GetTeachersParams,
  GetTeachersResponse,
  Teacher,
} from '@/types/teacher';

import axiosInstance from '@/services/axios-instance';

const teacherApi = {
  getAll: (params: GetTeachersParams): Promise<GetTeachersResponse> =>
    axiosInstance.get('/cms-teachers', { params }),
  getById: (id: string): Promise<Teacher> =>
    axiosInstance.get(`/cms-teachers/${id}`),
  create: (payload: CreateTeacherPayload): Promise<Teacher> =>
    axiosInstance.post('/cms-teachers', payload),
  edit: ({ id, ...payload }: EditTeacherPayload): Promise<Teacher> =>
    axiosInstance.patch(`/cms-teachers/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/cms-teachers', { data: { ids } }),
};

export default teacherApi;
