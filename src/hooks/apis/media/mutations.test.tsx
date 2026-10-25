import { toast } from '@heroui/react';
import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import i18n from '@/i18n';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

import useDeleteMedia from './useDeleteMedia';
import useEditMedia from './useEditMedia';
import useUploadMedia from './useUploadMedia';

vi.mock('@heroui/react', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  toast: { success: vi.fn(), danger: vi.fn() },
}));

const UPLOAD_URL = 'https://r2.example.com/tests/7/image/key.png';

const renderWithClient = <T,>(hook: () => T) => {
  const queryClient = createTestQueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHookWithProviders(hook, { queryClient });
  return { result, invalidate };
};

beforeEach(() => {
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.danger).mockClear();
});

describe('useUploadMedia', () => {
  it('gets an upload URL, PUTs with its headers, then registers the media', async () => {
    const steps: string[] = [];
    let putHeaders: Headers | undefined;
    let mediaBody: unknown;
    server.use(
      http.post(`${API_URL}/media/upload-url`, () => {
        steps.push('upload-url');
        return HttpResponse.json({
          storageKey: 'tests/7/image/key.png',
          uploadUrl: UPLOAD_URL,
          headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public' },
          expiresIn: 600,
        });
      }),
      http.put(UPLOAD_URL, ({ request }) => {
        steps.push('put');
        putHeaders = request.headers;
        return new HttpResponse(null, { status: 200 });
      }),
      http.post(`${API_URL}/media`, async ({ request }) => {
        steps.push('media');
        mediaBody = await request.json();
        return HttpResponse.json({ id: 1 });
      }),
    );
    const { result, invalidate } = renderWithClient(useUploadMedia);
    const file = new File(['png'], 'map.png', { type: 'image/png' });

    await act(() =>
      result.current.mutateAsync({
        scope: MediaScope.TEST,
        ownerId: '7',
        kind: MediaKind.IMAGE,
        file,
      }),
    );

    expect(steps).toEqual(['upload-url', 'put', 'media']);
    expect(putHeaders?.get('Cache-Control')).toBe('public');
    expect(putHeaders?.get('Authorization')).toBeNull();
    expect(mediaBody).toEqual({
      scope: 'TEST',
      ownerId: '7',
      kind: 'IMAGE',
      storageKey: 'tests/7/image/key.png',
    });
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('media.toast.uploadSuccess'),
    );
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.MEDIA.LIST],
    });
  });
});

describe('useEditMedia', () => {
  it('patches the metadata and refreshes the media', async () => {
    let body: unknown;
    server.use(
      http.patch(`${API_URL}/media/:id`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ id: 3 });
      }),
    );
    const { result, invalidate } = renderWithClient(useEditMedia);

    await act(() =>
      result.current.mutateAsync({ id: 3, durationMs: 1200, transcript: null }),
    );

    expect(body).toEqual({ durationMs: 1200, transcript: null });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [REACT_QUERY_KEYS.MEDIA.BY_ID, 3],
    });
  });
});

describe('useDeleteMedia', () => {
  it('toasts the reason when the media is still in use', async () => {
    server.use(
      http.delete(`${API_URL}/media/:id`, () =>
        HttpResponse.json(
          { message: 'Media is in use', statusCode: 409 },
          { status: 409 },
        ),
      ),
    );
    const { result } = renderWithClient(useDeleteMedia);

    act(() => result.current.mutate(5));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('media.toast.deleteError'),
      { description: 'Media is in use' },
    );
  });
});
