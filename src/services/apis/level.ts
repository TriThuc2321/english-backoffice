import type { Message } from '@/types/common';
import type {
  CreateLevelPayload,
  EditLevelPayload,
  GetLevelsParams,
  GetLevelsResponse,
  Level,
} from '@/types/level';

import axiosInstance from '@/services/axios-instance';

const levelApi = {
  getAll: (params: GetLevelsParams): Promise<GetLevelsResponse> =>
    axiosInstance.get('/levels', { params }),
  getById: (id: string): Promise<Level> => axiosInstance.get(`/levels/${id}`),
  create: (payload: CreateLevelPayload): Promise<Level> =>
    axiosInstance.post('/levels', payload),
  edit: ({ id, ...payload }: EditLevelPayload): Promise<Level> =>
    axiosInstance.patch(`/levels/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/levels', { data: { ids } }),
};

export default levelApi;
