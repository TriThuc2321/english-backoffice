import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

import ENV from '@/configs/env.config';
import { AUTH_CLIENT, LOGIN_PATH } from '@/constants/auth';
import { getQueryClient } from '@/providers/reactQuery.provider';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/services/auth-token';

const REFRESH_TOKEN_ENDPOINT = '/auth/refresh';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = { access_token: string };

const axiosInstance = axios.create({
  baseURL: `${ENV.API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let refreshTokenRequest: Promise<string> | null = null;

const refreshAccessToken = () => {
  refreshTokenRequest ??= axiosInstance
    .post<unknown, RefreshResponse>(REFRESH_TOKEN_ENDPOINT, {
      client: AUTH_CLIENT,
    })
    .then(({ access_token }) => {
      setAccessToken(access_token);
      return access_token;
    })
    .finally(() => {
      refreshTokenRequest = null;
    });

  return refreshTokenRequest;
};

const endSession = () => {
  clearAccessToken();
  getQueryClient().clear();
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
};

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    } catch (refreshError) {
      endSession();
      return Promise.reject(refreshError);
    }

    return axiosInstance(originalRequest);
  },
);

export default axiosInstance;
