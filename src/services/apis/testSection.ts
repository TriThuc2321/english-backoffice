import type { Message } from '@/types/common';
import type {
  CreateTestSectionPayload,
  EditTestSectionPayload,
  GetTestSectionParams,
  GetTestSectionsResponse,
  TestSection,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const testSectionApi = {
  getAll: (params: GetTestSectionParams): Promise<GetTestSectionsResponse> =>
    axiosInstance.get('/test-sections', { params }),
  getById: (id: string): Promise<TestSection> =>
    axiosInstance.get(`/test-sections/${id}`),
  getByIds: (ids: string[]): Promise<TestSection[]> =>
    axiosInstance.get('/test-sections/by-ids', { params: { ids } }),
  getByTestId: (testId: string): Promise<TestSection[]> =>
    axiosInstance.get(`/test-sections/by-test/${testId}`),
  create: (payload: CreateTestSectionPayload): Promise<TestSection> =>
    axiosInstance.post('/test-sections', payload),
  edit: ({ id, ...payload }: EditTestSectionPayload): Promise<TestSection> =>
    axiosInstance.patch(`/test-sections/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/test-sections', { data: { ids } }),
};

export default testSectionApi;
