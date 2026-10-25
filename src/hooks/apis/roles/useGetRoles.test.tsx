import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithProviders } from '@/test/utils';

import useGetRoles from './useGetRoles';

describe('useGetRoles', () => {
  it('fetches roles with the given params', async () => {
    let search = '';
    server.use(
      http.get(`${API_URL}/roles`, ({ request }) => {
        search = new URL(request.url).search;
        return HttpResponse.json({
          data: [{ id: 1, name: 'Admin' }],
          total: 1,
        });
      }),
    );

    const { result } = renderHookWithProviders(() =>
      useGetRoles({ page: 2, take: 10 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({
      data: [{ id: 1, name: 'Admin' }],
      total: 1,
    });
    expect(search).toBe('?page=2&take=10');
  });

  it('exposes the API error', async () => {
    server.use(
      http.get(`${API_URL}/roles`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetRoles({}));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({ message: 'Forbidden' });
  });
});
