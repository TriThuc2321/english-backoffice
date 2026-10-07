import type { Message } from '@/types/common';
import type {
  CreateProgramPayload,
  EditProgramPayload,
  GetProgramsParams,
  GetProgramsResponse,
  Program,
} from '@/types/program';

import axiosInstance from '@/services/axios-instance';

const programApi = {
  getAll: (params: GetProgramsParams): Promise<GetProgramsResponse> =>
    axiosInstance.get('/programs', { params }),
  getById: (id: string): Promise<Program> =>
    axiosInstance.get(`/programs/${id}`),
  create: (payload: CreateProgramPayload): Promise<Program> =>
    axiosInstance.post('/programs', payload),
  edit: ({ id, ...payload }: EditProgramPayload): Promise<Program> =>
    axiosInstance.patch(`/programs/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/programs', { data: { ids } }),
};

export default programApi;
