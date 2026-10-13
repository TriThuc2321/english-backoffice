import type {
  CreateTestSectionPayload,
  DeleteResponse,
  EditTestSectionPayload,
  TestSection,
  ReorderTestSectionsPayload,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const testSectionApi = {
  getAll: (testId: number): Promise<TestSection[]> =>
    axiosInstance.get('/test-sections', { params: { testId } }),
  getById: (id: number): Promise<TestSection> =>
    axiosInstance.get(`/test-sections/${id}`),
  create: (payload: CreateTestSectionPayload): Promise<TestSection> =>
    axiosInstance.post('/test-sections', payload),
  edit: ({ id, ...payload }: EditTestSectionPayload): Promise<TestSection> =>
    axiosInstance.patch(`/test-sections/${id}`, payload),
  reorder: (payload: ReorderTestSectionsPayload): Promise<TestSection[]> =>
    axiosInstance.patch('/test-sections/reorder', payload),
  delete: (ids: number[]): Promise<DeleteResponse> =>
    axiosInstance.delete('/test-sections', { data: { ids } }),
};

export default testSectionApi;
