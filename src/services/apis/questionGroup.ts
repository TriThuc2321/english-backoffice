import type { Message } from '@/types/common';
import type {
  CreateQuestionGroupPayload,
  EditQuestionGroupPayload,
  GetQuestionGroupParams,
  GetQuestionGroupsResponse,
  QuestionGroup,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const questionGroupApi = {
  getAll: (
    params: GetQuestionGroupParams,
  ): Promise<GetQuestionGroupsResponse> =>
    axiosInstance.get('/question-groups', { params }),
  getById: (id: string): Promise<QuestionGroup> =>
    axiosInstance.get(`/question-groups/${id}`),
  getByIds: (ids: string[]): Promise<QuestionGroup[]> =>
    axiosInstance.get('/question-groups/by-ids', { params: { ids } }),
  getByTestSectionId: (testSectionId: string): Promise<QuestionGroup[]> =>
    axiosInstance.get(`/question-groups/by-test-section/${testSectionId}`),
  create: (payload: CreateQuestionGroupPayload): Promise<QuestionGroup> =>
    axiosInstance.post('/question-groups', payload),
  edit: ({
    id,
    ...payload
  }: EditQuestionGroupPayload): Promise<QuestionGroup> =>
    axiosInstance.patch(`/question-groups/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/question-groups', { data: { ids } }),
};

export default questionGroupApi;
