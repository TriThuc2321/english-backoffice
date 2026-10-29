import type {
  CreateTestPayload,
  DeleteResponse,
  EditTestPayload,
  GetTestsParams,
  GetTestsResponse,
  ImportTestPayload,
  ImportTestResult,
  Test,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const testApi = {
  getAll: (params: GetTestsParams): Promise<GetTestsResponse> =>
    axiosInstance.get('/tests', { params }),
  getById: (id: number): Promise<Test> => axiosInstance.get(`/tests/${id}`),
  create: (payload: CreateTestPayload): Promise<Test> =>
    axiosInstance.post('/tests', payload),
  import: (payload: ImportTestPayload): Promise<ImportTestResult> =>
    axiosInstance.post('/tests/import', payload),
  edit: ({ id, ...payload }: EditTestPayload): Promise<Test> =>
    axiosInstance.patch(`/tests/${id}`, payload),
  delete: (ids: number[]): Promise<DeleteResponse> =>
    axiosInstance.delete('/tests', { data: { ids } }),
};

export default testApi;
