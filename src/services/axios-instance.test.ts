import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';

import { LOGIN_PATH } from '@/constants/auth';
import { getQueryClient } from '@/providers/reactQuery.provider';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/services/auth-token';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

import axiosInstance from './axios-instance';

const bearer = (request: Request) =>
  request.headers.get('Authorization')?.replace(/^Bearer /, '');

// Protected endpoint that only accepts `validToken`
const protectedHandler = (validToken: string) =>
  http.get(`${API_URL}/me`, ({ request }) =>
    bearer(request) === validToken
      ? HttpResponse.json({ id: 1 })
      : HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
  );

describe('axiosInstance', () => {
  beforeEach(() => {
    clearAccessToken();
  });

  it('unwraps the response body', async () => {
    server.use(
      http.get(`${API_URL}/ping`, () => HttpResponse.json({ ok: true })),
    );

    await expect(axiosInstance.get('/ping')).resolves.toEqual({ ok: true });
  });

  it('rejects with the error body', async () => {
    server.use(
      http.get(`${API_URL}/boom`, () =>
        HttpResponse.json({ message: 'Bad' }, { status: 400 }),
      ),
    );

    await expect(axiosInstance.get('/boom')).rejects.toEqual({
      message: 'Bad',
    });
  });

  it('sends the access token as a bearer header', async () => {
    setAccessToken('abc');
    server.use(protectedHandler('abc'));

    await expect(axiosInstance.get('/me')).resolves.toEqual({ id: 1 });
  });

  it('refreshes once for concurrent 401s and retries with the new token', async () => {
    setAccessToken('stale');
    let refreshCalls = 0;
    server.use(
      protectedHandler('fresh'),
      http.post(`${API_URL}/auth/refresh`, () => {
        refreshCalls += 1;
        return HttpResponse.json({ access_token: 'fresh' });
      }),
    );

    const results = await Promise.all([
      axiosInstance.get('/me'),
      axiosInstance.get('/me'),
      axiosInstance.get('/me'),
    ]);

    expect(results).toEqual([{ id: 1 }, { id: 1 }, { id: 1 }]);
    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe('fresh');
  });

  it('ends the session when the refresh fails', async () => {
    // Already on the login page, so endSession does not navigate (unsupported in jsdom)
    window.history.pushState({}, '', LOGIN_PATH);
    setAccessToken('stale');
    getQueryClient().setQueryData(['cached'], 'value');
    server.use(
      protectedHandler('fresh'),
      http.post(`${API_URL}/auth/refresh`, () =>
        HttpResponse.json({ message: 'Expired' }, { status: 401 }),
      ),
    );

    await expect(axiosInstance.get('/me')).rejects.toEqual({
      message: 'Expired',
    });
    expect(getAccessToken()).toBeNull();
    expect(getQueryClient().getQueryData(['cached'])).toBeUndefined();
  });

  it('does not retry a request that already failed after a refresh', async () => {
    setAccessToken('stale');
    let refreshCalls = 0;
    server.use(
      protectedHandler('never-valid'),
      http.post(`${API_URL}/auth/refresh`, () => {
        refreshCalls += 1;
        return HttpResponse.json({ access_token: 'fresh' });
      }),
    );

    await expect(axiosInstance.get('/me')).rejects.toEqual({
      message: 'Unauthorized',
    });
    expect(refreshCalls).toBe(1);
  });
});
