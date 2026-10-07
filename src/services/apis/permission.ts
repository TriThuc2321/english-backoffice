import type { GetPermissionsResponse } from '@/types/permission';

import axiosInstance from '@/services/axios-instance';

const permissionApi = {
  getAll: (): Promise<GetPermissionsResponse> =>
    axiosInstance.get('/permissions'),
};

export default permissionApi;
