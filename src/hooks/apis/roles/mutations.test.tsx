import { toast } from '@heroui/react';
import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import i18n from '@/i18n';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils';

import useCreateRole from './useCreateRole';
import useDeleteRole from './useDeleteRole';
import useEditRole from './useEditRole';

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

describe('useCreateRole', () => {
  const payload = {
    name: 'Teacher',
    code: 'TEACHER',
    canAccessCms: true,
    permissionIds: [1, 2],
  };

  it('posts the role, toasts and invalidates the list', async () => {
    let body: unknown;
    server.use(
      http.post(`${API_URL}/roles`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 3, ...payload }, { status: 201 });
      }),
    );
    const { result, invalidate } = renderMutation(useCreateRole);

    await act(() => result.current.mutateAsync(payload));

    expect(body).toEqual(payload);
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('roles.toast.createSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.ROLE.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.post(`${API_URL}/roles`, () =>
        HttpResponse.json({ message: 'Code exists' }, { status: 409 }),
      ),
    );
    const { result, invalidate } = renderMutation(useCreateRole);

    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('roles.toast.createError'),
      { description: 'Code exists' },
    );
    expect(invalidate).not.toHaveBeenCalled();
  });
});

describe('useEditRole', () => {
  it('patches without the id in the body and invalidates list and detail', async () => {
    let body: unknown;
    let id: unknown;
    server.use(
      http.patch(`${API_URL}/roles/:id`, async ({ request, params }) => {
        id = params.id;
        body = await request.json();
        return HttpResponse.json({ id: 3 });
      }),
    );
    const { result, invalidate } = renderMutation(useEditRole);

    await act(() => result.current.mutateAsync({ id: '3', name: 'Renamed' }));

    expect(id).toBe('3');
    expect(body).toEqual({ name: 'Renamed' });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('roles.toast.updateSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.ROLE.LIST],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.ROLE.BY_ID],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.patch(`${API_URL}/roles/:id`, () =>
        HttpResponse.json({ message: 'System role' }, { status: 400 }),
      ),
    );
    const { result } = renderMutation(useEditRole);

    act(() => result.current.mutate({ id: '1', name: 'x' }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('roles.toast.updateError'),
      { description: 'System role' },
    );
  });
});

describe('useDeleteRole', () => {
  it('sends the ids in the body and invalidates the list', async () => {
    let body: unknown;
    server.use(
      http.delete(`${API_URL}/roles`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ deleted: 2 });
      }),
    );
    const { result, invalidate } = renderMutation(useDeleteRole);

    await act(() => result.current.mutateAsync([4, 5]));

    expect(body).toEqual({ ids: [4, 5] });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('roles.toast.deleteSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.ROLE.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.delete(`${API_URL}/roles`, () =>
        HttpResponse.json({ message: 'Role in use' }, { status: 400 }),
      ),
    );
    const { result } = renderMutation(useDeleteRole);

    act(() => result.current.mutate([4]));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('roles.toast.deleteError'),
      { description: 'Role in use' },
    );
  });
});
