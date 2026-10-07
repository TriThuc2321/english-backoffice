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
  getProfile: (): Promise<User> => axiosInstance.get('/auth/profile'),
  getAll: (params: GetUsersParams): Promise<GetUsersResponse> =>
    axiosInstance.get('/users', { params }),
  getById: (id: string): Promise<User> => axiosInstance.get(`/users/${id}`),
  create: (payload: CreateUserPayload): Promise<User> =>
    axiosInstance.post('/users', payload),
  edit: ({ id, ...payload }: EditUserPayload): Promise<User> =>
    axiosInstance.patch(`/users/${id}`, payload),
  delete: (ids: string[]): Promise<Message> =>
    axiosInstance.delete('/users', { data: { ids } }),
};

export default userApi;
