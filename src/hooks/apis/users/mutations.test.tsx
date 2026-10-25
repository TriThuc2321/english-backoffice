import { toast } from '@heroui/react';
import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import i18n from '@/i18n';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils';

import useCreateUser from './useCreateUser';
import useDeleteUser from './useDeleteUser';
import useEditUser from './useEditUser';

vi.mock('@heroui/react', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  toast: { success: vi.fn(), danger: vi.fn() },
}));

const renderMutation = <T,>(hook: () => T) => {
  const queryClient = createTestQueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHookWithProviders(hook, { queryClient });
  return { result, invalidate };
};

beforeEach(() => {
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.danger).mockClear();
});

describe('useCreateUser', () => {
  const payload = {
    email: 'new@myenglish.vn',
    firstName: 'New',
    lastName: 'User',
    roleId: 2,
  };

  it('posts the user, toasts and invalidates the list', async () => {
    let body: unknown;
    server.use(
      http.post(`${API_URL}/users`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 'u1', ...payload }, { status: 201 });
      }),
    );
    const { result, invalidate } = renderMutation(useCreateUser);

    await act(() => result.current.mutateAsync(payload));

    expect(body).toEqual(payload);
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('cmsUsers.toast.createSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.USER.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.post(`${API_URL}/users`, () =>
        HttpResponse.json({ message: 'Email exists' }, { status: 409 }),
      ),
    );
    const { result, invalidate } = renderMutation(useCreateUser);

    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('cmsUsers.toast.createError'),
      { description: 'Email exists' },
    );
    expect(invalidate).not.toHaveBeenCalled();
  });
});

describe('useEditUser', () => {
  it('patches without the id in the body and invalidates list and detail', async () => {
    let body: unknown;
    let id: unknown;
    server.use(
      http.patch(`${API_URL}/users/:id`, async ({ request, params }) => {
        id = params.id;
        body = await request.json();
        return HttpResponse.json({ id: 'u1' });
      }),
    );
    const { result, invalidate } = renderMutation(useEditUser);

    await act(() =>
      result.current.mutateAsync({ id: 'u1', lastName: 'Edited', roleId: 3 }),
    );

    expect(id).toBe('u1');
    expect(body).toEqual({ lastName: 'Edited', roleId: 3 });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('cmsUsers.toast.updateSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.USER.LIST],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.USER.BY_ID],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.patch(`${API_URL}/users/:id`, () =>
        HttpResponse.json({ message: 'System user' }, { status: 400 }),
      ),
    );
    const { result } = renderMutation(useEditUser);

    act(() => result.current.mutate({ id: 'u1', lastName: 'x' }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('cmsUsers.toast.updateError'),
      { description: 'System user' },
    );
  });
});

describe('useDeleteUser', () => {
  it('sends the ids in the body and invalidates the list', async () => {
    let body: unknown;
    server.use(
      http.delete(`${API_URL}/users`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ deleted: 2 });
      }),
    );
    const { result, invalidate } = renderMutation(useDeleteUser);

    await act(() => result.current.mutateAsync(['u1', 'u2']));

    expect(body).toEqual({ ids: ['u1', 'u2'] });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('cmsUsers.toast.deleteSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.USER.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.delete(`${API_URL}/users`, () =>
        HttpResponse.json({ message: 'Cannot delete' }, { status: 400 }),
      ),
    );
    const { result } = renderMutation(useDeleteUser);

    act(() => result.current.mutate(['u1']));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('cmsUsers.toast.deleteError'),
      { description: 'Cannot delete' },
    );
  });
});
