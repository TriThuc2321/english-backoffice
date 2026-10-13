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

type AuthChannelMessage =
  | { type: 'token'; access_token: string }
  | { type: 'logout' };

const axiosInstance = axios.create({
  baseURL: `${ENV.API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const REFRESH_LOCK_NAME = 'myenglish-bo:auth-refresh';
const authChannel =
  typeof BroadcastChannel === 'undefined'
    ? null
    : new BroadcastChannel('myenglish-bo:auth');

const postAuthMessage = (message: AuthChannelMessage) => {
  authChannel?.postMessage(message);
};

// Serialize refresh across tabs: the refresh token cookie is shared and rotated
// on every refresh, so concurrent refreshes from several tabs would reuse a
// stale cookie and get the session revoked.
const withRefreshLock = <T>(callback: () => Promise<T>) =>
  typeof navigator !== 'undefined' && navigator.locks
    ? (navigator.locks.request(REFRESH_LOCK_NAME, callback) as Promise<T>)
    : callback();

let refreshTokenRequest: Promise<string> | null = null;

const refreshAccessToken = (staleToken: string | null) => {
  refreshTokenRequest ??= withRefreshLock(async () => {
    // Another tab refreshed while we were waiting for the lock.
    const currentToken = getAccessToken();
    if (currentToken && currentToken !== staleToken) {
      return currentToken;
    }

    const { access_token } = await axiosInstance.post<unknown, RefreshResponse>(
      REFRESH_TOKEN_ENDPOINT,
      { client: AUTH_CLIENT },
    );

    setAccessToken(access_token);
    postAuthMessage({ type: 'token', access_token });
    return access_token;
  }).finally(() => {
    refreshTokenRequest = null;
  });

  return refreshTokenRequest;
};

export const endSession = ({ broadcast = false } = {}) => {
  clearAccessToken();
  getQueryClient().clear();
  if (broadcast) {
    postAuthMessage({ type: 'logout' });
  }
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
};

authChannel?.addEventListener(
  'message',
  ({ data }: MessageEvent<AuthChannelMessage>) => {
    if (data.type === 'token') {
      setAccessToken(data.access_token);
    } else if (data.type === 'logout') {
      endSession();
    }
  },
);

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
    const authorization = originalRequest.headers.Authorization;
    const staleToken =
      typeof authorization === 'string'
        ? authorization.replace(/^Bearer /, '')
        : null;

    try {
      await refreshAccessToken(staleToken);
    } catch (refreshError) {
      endSession();
      return Promise.reject(refreshError);
    }

    return axiosInstance(originalRequest);
  },
);

export default axiosInstance;
