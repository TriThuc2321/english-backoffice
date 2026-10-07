import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

import type { ICookieStore } from '@/types/auth';

import ENV from '@/configs/env.config';
import { convertObjectToCookies } from '@/utils/common';

const REFRESH_TOKEN_ENDPOINT = '/auth/refresh-token';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const axiosInstance = axios.create({
  baseURL: `${ENV.API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let refreshTokenRequest: Promise<unknown> | null = null;

const refreshAccessToken = () => {
  if (!refreshTokenRequest) {
    refreshTokenRequest = axiosInstance
      .post(REFRESH_TOKEN_ENDPOINT, {})
      .finally(() => {
        refreshTokenRequest = null;
      });
  }

  return refreshTokenRequest;
};

axiosInstance.interceptors.response.use(
  (response) => response.data,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const shouldRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== REFRESH_TOKEN_ENDPOINT;

    if (!shouldRefresh) {
      return Promise.reject(error.response?.data);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export const setHeaderCookies = (cookieStore: ICookieStore[]) => {
  axiosInstance.defaults.headers.Cookie = convertObjectToCookies(cookieStore);
};

export default axiosInstance;
