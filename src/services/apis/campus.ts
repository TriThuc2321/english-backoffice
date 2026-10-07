import type {
  Campus,
  CreateCampusPayload,
  EditCampusPayload,
  GetCampusesParams,
  GetCampusesResponse,
} from '@/types/campus';
import type { Message } from '@/types/common';

import axiosInstance from '@/services/axios-instance';

const campusApi = {
  getAll: (params: GetCampusesParams): Promise<GetCampusesResponse> =>
    axiosInstance.get('/campuses', { params }),
  getById: (id: string): Promise<Campus> =>
    axiosInstance.get(`/campuses/${id}`),
  create: (payload: CreateCampusPayload): Promise<Campus> =>
    axiosInstance.post('/campuses', payload),
  edit: ({ id, ...payload }: EditCampusPayload): Promise<Campus> =>
    axiosInstance.patch(`/campuses/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/campuses', { data: { ids } }),
};

export default campusApi;
