import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithProviders } from '@/test/utils';
import { Status } from '@/types/common';

import useGetUserById from './useGetUserById';
import useGetUsers from './useGetUsers';

describe('useGetUsers', () => {
  it('sends the filters as query params', async () => {
    let search = '';
    server.use(
      http.get(`${API_URL}/users`, ({ request }) => {
        search = new URL(request.url).search;
        return HttpResponse.json({ data: [{ id: 'u1' }], meta: { page: 1 } });
      }),
    );

    const { result } = renderHookWithProviders(() =>
      useGetUsers({
        page: 1,
        take: 20,
        search: 'ada',
        roleId: 2,
        status: Status.ACTIVE,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual([{ id: 'u1' }]);
    expect(Object.fromEntries(new URLSearchParams(search))).toEqual({
      page: '1',
      take: '20',
      search: 'ada',
      roleId: '2',
      status: 'ACTIVE',
    });
  });

  it('exposes the API error', async () => {
    server.use(
      http.get(`${API_URL}/users`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetUsers({}));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({ message: 'Forbidden' });
  });
});

describe('useGetUserById', () => {
  it('fetches the user by id', async () => {
    server.use(
      http.get(`${API_URL}/users/:id`, ({ params }) =>
        HttpResponse.json({ id: params.id, email: 'a@b.com' }),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetUserById('u1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 'u1', email: 'a@b.com' });
  });
});
