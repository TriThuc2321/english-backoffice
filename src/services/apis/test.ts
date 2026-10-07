import type { Message } from '@/types/common';
import type {
  CreateTestPayload,
  EditTestPayload,
  GetTestsParams,
  GetTestsResponse,
  Test,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const testApi = {
  getAll: (params: GetTestsParams): Promise<GetTestsResponse> =>
    axiosInstance.get('/tests', { params }),
  getById: (id: string): Promise<Test> => axiosInstance.get(`/tests/${id}`),
  create: (payload: CreateTestPayload): Promise<Test> =>
    axiosInstance.post('/tests', payload),
  edit: ({ id, ...payload }: EditTestPayload): Promise<Test> =>
    axiosInstance.patch(`/tests/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/tests', { data: { ids } }),
};

export default testApi;
