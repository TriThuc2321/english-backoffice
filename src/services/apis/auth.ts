import { AUTH_CLIENT } from '@/constants/auth';

import axiosInstance from '../axios-instance';

const authApi = {
  logout: () => axiosInstance.post('/auth/logout', { client: AUTH_CLIENT }),
};

export default authApi;
