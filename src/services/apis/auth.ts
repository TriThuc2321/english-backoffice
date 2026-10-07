import axiosInstance from '../axios-instance';

const authApi = {
  logout: () => axiosInstance.post('/auth/logout'),
};

export default authApi;
