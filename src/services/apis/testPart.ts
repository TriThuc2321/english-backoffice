import type {
  CreateTestPartPayload,
  DeleteResponse,
  EditTestPartPayload,
  TestPart,
  ReorderTestPartsPayload,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const testPartApi = {
  getAll: (sectionId: number): Promise<TestPart[]> =>
    axiosInstance.get('/test-parts', { params: { sectionId } }),
  getById: (id: number): Promise<TestPart> =>
    axiosInstance.get(`/test-parts/${id}`),
  create: (payload: CreateTestPartPayload): Promise<TestPart> =>
    axiosInstance.post('/test-parts', payload),
  edit: ({ id, ...payload }: EditTestPartPayload): Promise<TestPart> =>
    axiosInstance.patch(`/test-parts/${id}`, payload),
  reorder: (payload: ReorderTestPartsPayload): Promise<TestPart[]> =>
    axiosInstance.patch('/test-parts/reorder', payload),
  delete: (ids: number[]): Promise<DeleteResponse> =>
    axiosInstance.delete('/test-parts', { data: { ids } }),
};

export default testPartApi;
