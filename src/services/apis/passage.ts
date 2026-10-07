import type { Message } from '@/types/common';
import type {
  CreatePassagePayload,
  EditPassagePayload,
  GetPassageParams,
  GetPassagesResponse,
  Passage,
} from '@/types/passage';

import axiosInstance from '@/services/axios-instance';

const passageApi = {
  getAll: (params: GetPassageParams): Promise<GetPassagesResponse> =>
    axiosInstance.get('/passages', { params }),
  getById: (id: string): Promise<Passage> =>
    axiosInstance.get(`/passages/${id}`),
  create: (payload: CreatePassagePayload): Promise<Passage> =>
    axiosInstance.post('/passages', payload),
  edit: ({ id, ...payload }: EditPassagePayload): Promise<Passage> =>
    axiosInstance.patch(`/passages/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/passages', { data: { ids } }),
};

export default passageApi;
