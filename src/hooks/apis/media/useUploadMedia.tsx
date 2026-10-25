import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { UploadMediaPayload } from '@/types/media';

import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';
import { MediaKind } from '@/types/test';
import { assertMediaFile } from '@/utils/media';

const readAudioDuration = (file: File) =>
  new Promise<number | undefined>((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    const done = (value?: number) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    audio.preload = 'metadata';
    audio.onloadedmetadata = () =>
      done(
        Number.isFinite(audio.duration)
          ? Math.round(audio.duration * 1000)
          : undefined,
      );
    audio.onerror = () => done();
    audio.src = url;
  });

const useUploadMedia = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ scope, ownerId, kind, file }: UploadMediaPayload) => {
      assertMediaFile(t, file, scope, kind);

      const durationMs =
        kind === MediaKind.AUDIO ? await readAudioDuration(file) : undefined;
      const { storageKey, uploadUrl, headers } = await mediaApi.getUploadUrl({
        scope,
        ownerId,
        kind,
        contentType: file.type,
      });
      await mediaApi.putFile(uploadUrl, file, headers);

      return mediaApi.create({
        scope,
        ownerId,
        kind,
        storageKey,
        durationMs,
      });
    },
    onSuccess: () => {
      toast.success(t('tests.toast.mediaUploadSuccess'));
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.MEDIA.LIST],
      });
    },
    onError: (err) => {
      toast.danger(t('tests.toast.mediaUploadError'), {
        description: err.message,
      });
    },
  });
};

export default useUploadMedia;
