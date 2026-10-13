import type {
  CreateQuestionGroupPayload,
  DeleteResponse,
  EditQuestionGroupPayload,
  QuestionGroup,
  ReorderQuestionGroupsPayload,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const questionGroupApi = {
  getAll: (partId: number): Promise<QuestionGroup[]> =>
    axiosInstance.get('/question-groups', { params: { partId } }),
  getById: (id: number): Promise<QuestionGroup> =>
    axiosInstance.get(`/question-groups/${id}`),
  create: (payload: CreateQuestionGroupPayload): Promise<QuestionGroup> =>
    axiosInstance.post('/question-groups', payload),
  edit: ({
    id,
    ...payload
  }: EditQuestionGroupPayload): Promise<QuestionGroup> =>
    axiosInstance.patch(`/question-groups/${id}`, payload),
  reorder: (payload: ReorderQuestionGroupsPayload): Promise<QuestionGroup[]> =>
    axiosInstance.patch('/question-groups/reorder', payload),
  delete: (ids: number[]): Promise<DeleteResponse> =>
    axiosInstance.delete('/question-groups', { data: { ids } }),
};

export default questionGroupApi;
