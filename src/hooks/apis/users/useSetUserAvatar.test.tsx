import { toast } from '@heroui/react';
import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import i18n from '@/i18n';
import { API_URL } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils';

import useSetUserAvatar from './useSetUserAvatar';

vi.mock('@heroui/react', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  toast: { success: vi.fn(), danger: vi.fn() },
}));

const UPLOAD_URL = 'https://r2.example.com/avatars/key';

const renderAvatarHook = () => {
  const queryClient = createTestQueryClient();
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const { result } = renderHookWithProviders(useSetUserAvatar, {
    queryClient,
  });
  return { result, invalidate };
};

const capturePatch = () => {
  const patches: unknown[] = [];
  server.use(
    http.patch(`${API_URL}/users/:id`, async ({ request }) => {
      patches.push(await request.json());
      return HttpResponse.json({ id: 'u1' });
    }),
  );
  return patches;
};

beforeEach(() => {
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.danger).mockClear();
});

describe('useSetUserAvatar', () => {
  it('removes the avatar with a single PATCH', async () => {
    const patches = capturePatch();
    const { result } = renderAvatarHook();

    await act(() => result.current.mutateAsync({ id: 'u1', file: null }));

    expect(patches).toEqual([{ avatarMediaId: null }]);
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('avatar.toast.removeSuccess'),
    );
  });

  it('uploads the file, creates the media and links it to the user', async () => {
    const steps: string[] = [];
    let uploadBody: unknown;
    let mediaBody: unknown;
    server.use(
      http.post(`${API_URL}/media/upload-url`, async ({ request }) => {
        steps.push('upload-url');
        uploadBody = await request.json();
        return HttpResponse.json({
          storageKey: 'avatars/key',
          uploadUrl: UPLOAD_URL,
          headers: { 'Content-Type': 'image/png' },
          expiresIn: 600,
        });
      }),
      http.put(UPLOAD_URL, () => {
        steps.push('put');
        return new HttpResponse(null, { status: 200 });
      }),
      http.post(`${API_URL}/media`, async ({ request }) => {
        steps.push('media');
        mediaBody = await request.json();
        return HttpResponse.json({ id: 42 });
      }),
    );
    const patches = capturePatch();
    const { result, invalidate } = renderAvatarHook();
    const file = new File(['png'], 'me.png', { type: 'image/png' });

    await act(() => result.current.mutateAsync({ id: 'u1', file }));

    expect(steps).toEqual(['upload-url', 'put', 'media']);
    expect(uploadBody).toEqual({
      scope: 'AVATAR',
      ownerId: 'u1',
      kind: 'IMAGE',
      contentType: 'image/png',
    });
    expect(mediaBody).toEqual({
      scope: 'AVATAR',
      ownerId: 'u1',
      kind: 'IMAGE',
      storageKey: 'avatars/key',
    });
    expect(patches).toEqual([{ avatarMediaId: 42 }]);
    expect(toast.success).toHaveBeenCalledWith(
      i18n.t('avatar.toast.updateSuccess'),
    );
    for (const key of [
      REACT_QUERY_KEYS.USER.LIST,
      REACT_QUERY_KEYS.USER.BY_ID,
      REACT_QUERY_KEYS.USER.PROFILE,
    ]) {
      expect(invalidate).toHaveBeenCalledWith({ queryKey: [key] });
    }
  });

  it('rejects an unsupported file type before any request', async () => {
    const patches = capturePatch();
    const { result } = renderAvatarHook();
    const file = new File(['gif'], 'me.gif', { type: 'image/gif' });

    act(() => result.current.mutate({ id: 'u1', file }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(patches).toEqual([]);
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('avatar.toast.updateError'),
      { description: i18n.t('media.invalidType') },
    );
  });

  it('stops when the storage upload fails', async () => {
    server.use(
      http.post(`${API_URL}/media/upload-url`, () =>
        HttpResponse.json({
          storageKey: 'avatars/key',
          uploadUrl: UPLOAD_URL,
          headers: {},
          expiresIn: 600,
        }),
      ),
      http.put(UPLOAD_URL, () => new HttpResponse(null, { status: 403 })),
    );
    const patches = capturePatch();
    const { result } = renderAvatarHook();
    const file = new File(['png'], 'me.png', { type: 'image/png' });

    act(() => result.current.mutate({ id: 'u1', file }));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(patches).toEqual([]);
    expect(toast.danger).toHaveBeenCalledWith(
      i18n.t('avatar.toast.updateError'),
      { description: 'Upload failed (403)' },
    );
  });
});
