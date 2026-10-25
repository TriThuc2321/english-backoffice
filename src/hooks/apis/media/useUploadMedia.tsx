import { toast } from '@heroui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type { UploadMediaPayload } from '@/types/media';

import { MEDIA_CONTENT_TYPES, MEDIA_MAX_BYTES } from '@/constants/media';
import { REACT_QUERY_KEYS } from '@/constants/reactQuery';
import { mediaApi } from '@/services/apis';
import { MediaKind } from '@/types/test';

// Best effort: the API accepts audio without a duration
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
    mutationFn: async ({ testId, kind, file }: UploadMediaPayload) => {
      if (!MEDIA_CONTENT_TYPES[kind].includes(file.type)) {
        throw { message: t('tests.editor.media.invalidType') };
      }
      if (file.size > MEDIA_MAX_BYTES[kind]) {
        throw {
          message: t('tests.editor.media.tooLarge', {
            size: MEDIA_MAX_BYTES[kind] / 1024 / 1024,
          }),
        };
      }

      const durationMs =
        kind === MediaKind.AUDIO ? await readAudioDuration(file) : undefined;
      const { storageKey, uploadUrl, headers } = await mediaApi.getUploadUrl({
        testId,
        kind,
        contentType: file.type,
      });
      await mediaApi.putFile(uploadUrl, file, headers);

      return mediaApi.create({ testId, kind, storageKey, durationMs });
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
