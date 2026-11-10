import { AUTH_CLIENT } from '@/constants/auth';

import axiosInstance from '../axios-instance';

export type LoginPayload = { email: string; password: string };
export type ForgotPasswordPayload = { email: string };
export type ResetPasswordPayload = {
  email: string;
  code: string;
  newPassword: string;
};
export type TokenResponse = { access_token: string };

const authApi = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<unknown, TokenResponse>('/auth/login', {
      ...payload,
      client: AUTH_CLIENT,
    }),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    axiosInstance.post('/auth/forgot-password', payload),
  resetPassword: (payload: ResetPasswordPayload) =>
    axiosInstance.post('/auth/reset-password', payload),
  logout: () => axiosInstance.post('/auth/logout', { client: AUTH_CLIENT }),
};

export default authApi;
