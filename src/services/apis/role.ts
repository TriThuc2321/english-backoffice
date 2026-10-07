import type { Message } from '@/types/common';
import type {
  CreateRolePayload,
  EditRolePayload,
  GetRolesParams,
  GetRolesResponse,
  Role,
} from '@/types/role';

import axiosInstance from '@/services/axios-instance';

const roleApi = {
  getAll: (params: GetRolesParams): Promise<GetRolesResponse> =>
    axiosInstance.get('/cms-roles', { params }),
  getById: (id: string): Promise<Role> => axiosInstance.get(`/cms-roles/${id}`),
  create: (payload: CreateRolePayload): Promise<Role> =>
    axiosInstance.post('/cms-roles', payload),
  edit: ({ id, ...payload }: EditRolePayload): Promise<Role> =>
    axiosInstance.patch(`/cms-roles/${id}`, payload),
  delete: (ids: number[]): Promise<Message> =>
    axiosInstance.delete('/cms-roles', { data: { ids } }),
};

export default roleApi;
