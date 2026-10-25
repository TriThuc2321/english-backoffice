import { toast } from '@heroui/react';
import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import i18n from '@/i18n';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils';
import { MarkedBy } from '@/types/common';
import { PassageStatus } from '@/types/passage';

import useCreatePassage from './useCreatePassage';
import useDeletePassage from './useDeletePassage';
import useEditPassage from './useEditPassage';

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

describe('useCreatePassage', () => {
  const payload = {
    title: 'The Nile',
    subtitle: '',
    markedBy: MarkedBy.ALPHABET,
    paragraphs: [{ content: 'A' }, { content: 'B' }],
  };

  it('posts the passage, toasts and invalidates the list', async () => {
    let body: unknown;
    server.use(
      http.post(`${API_URL}/passages`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 'p1', ...payload }, { status: 201 });
      }),
    );
    const { result, invalidate } = renderMutation(useCreatePassage);

    await act(() => result.current.mutateAsync(payload));

    expect(body).toEqual(payload);
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('passages.toast.createSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.post(`${API_URL}/passages`, () =>
        HttpResponse.json({ message: 'Bad paragraphs' }, { status: 400 }),
      ),
    );
    const { result, invalidate } = renderMutation(useCreatePassage);

    act(() => result.current.mutate(payload));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('passages.toast.createError'),
      { description: 'Bad paragraphs' },
    );
    expect(invalidate).not.toHaveBeenCalled();
  });
});

describe('useEditPassage', () => {
  it('patches without the id in the body and invalidates this passage and the list', async () => {
    let body: unknown;
    let id: unknown;
    server.use(
      http.patch(`${API_URL}/passages/:id`, async ({ request, params }) => {
        id = params.id;
        body = await request.json();
        return HttpResponse.json({ id: 'p1' });
      }),
    );
    const { result, invalidate } = renderMutation(useEditPassage);

    await act(() =>
      result.current.mutateAsync({ id: 'p1', status: PassageStatus.PUBLISHED }),
    );

    expect(id).toBe('p1');
    expect(body).toEqual({ status: 'PUBLISHED' });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('passages.toast.updateSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.PASSAGE.BY_ID, 'p1'],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.patch(`${API_URL}/passages/:id`, () =>
        HttpResponse.json({ message: 'Not found' }, { status: 404 }),
      ),
    );
    const { result } = renderMutation(useEditPassage);

    act(() => result.current.mutate({ id: 'p1', title: 'x' }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('passages.toast.updateError'),
      { description: 'Not found' },
    );
  });
});

describe('useDeletePassage', () => {
  it('sends the ids in the body and invalidates the list', async () => {
    let body: unknown;
    server.use(
      http.delete(`${API_URL}/passages`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ deleted: 2 });
      }),
    );
    const { result, invalidate } = renderMutation(useDeletePassage);

    await act(() => result.current.mutateAsync(['p1', 'p2']));

    expect(body).toEqual({ ids: ['p1', 'p2'] });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('passages.toast.deleteSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.PASSAGE.LIST],
    });
  });

  it('toasts the API error message', async () => {
    server.use(
      http.delete(`${API_URL}/passages`, () =>
        HttpResponse.json({ message: 'Used by a test' }, { status: 400 }),
      ),
    );
    const { result } = renderMutation(useDeletePassage);

    act(() => result.current.mutate(['p1']));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('passages.toast.deleteError'),
      { description: 'Used by a test' },
    );
  });
});
