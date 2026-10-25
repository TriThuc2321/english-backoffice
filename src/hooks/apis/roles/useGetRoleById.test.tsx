import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderHookWithProviders } from '@/test/utils';

import useGetRoleById from './useGetRoleById';

describe('useGetRoleById', () => {
  it('fetches the role by id', async () => {
    server.use(
      http.get(`${API_URL}/roles/:id`, ({ params }) =>
        HttpResponse.json({ id: Number(params.id), name: 'Admin' }),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetRoleById('7'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 7, name: 'Admin' });
  });

  it('exposes the API error', async () => {
    server.use(
      http.get(`${API_URL}/roles/:id`, () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 }),
      ),
    );

    const { result } = renderHookWithProviders(() => useGetRoleById('7'));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({ message: 'Not found' });
  });
});
