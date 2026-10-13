import type {
  CreateQuestionPayload,
  DeleteResponse,
  EditQuestionPayload,
  Question,
  ReorderQuestionsPayload,
} from '@/types/test';

import axiosInstance from '@/services/axios-instance';

const questionApi = {
  getAll: (groupId: number): Promise<Question[]> =>
    axiosInstance.get('/questions', { params: { groupId } }),
  getById: (id: number): Promise<Question> =>
    axiosInstance.get(`/questions/${id}`),
  create: (payload: CreateQuestionPayload): Promise<Question> =>
    axiosInstance.post('/questions', payload),
  edit: ({ id, ...payload }: EditQuestionPayload): Promise<Question> =>
    axiosInstance.patch(`/questions/${id}`, payload),
  reorder: (payload: ReorderQuestionsPayload): Promise<Question[]> =>
    axiosInstance.patch('/questions/reorder', payload),
  delete: (ids: number[]): Promise<DeleteResponse> =>
    axiosInstance.delete('/questions', { data: { ids } }),
};

export default questionApi;
