import type { Message } from '@/types/common';
import type {
  User,
  CreateUserPayload,
  EditUserPayload,
  GetUsersParams,
  GetUsersResponse,
} from '@/types/user';

import axiosInstance from '@/services/axios-instance';

const userApi = {
  getProfile: (): Promise<User> => axiosInstance.get('profile'),
  getAll: (params: GetUsersParams): Promise<GetUsersResponse> =>
    axiosInstance.get('/cms-users', { params }),
  getById: (id: string): Promise<User> => axiosInstance.get(`/cms-users/${id}`),
  create: (payload: CreateUserPayload): Promise<User> =>
    axiosInstance.post('/cms-users', payload),
  edit: ({ id, ...payload }: EditUserPayload): Promise<User> =>
    axiosInstance.patch(`/cms-users/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/cms-users', { data: { ids } }),
};

export default userApi;
