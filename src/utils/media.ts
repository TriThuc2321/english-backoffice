import type { TFunction } from 'i18next';

import type { MediaScope } from '@/types/media';
import type { MediaKind } from '@/types/test';

import { MEDIA_CONTENT_TYPES, MEDIA_MAX_BYTES } from '@/constants/media';

export const assertMediaFile = (
  t: TFunction,
  file: File,
  scope: MediaScope,
  kind: MediaKind,
) => {
  const maxBytes = MEDIA_MAX_BYTES[scope][kind];
  if (!maxBytes || !MEDIA_CONTENT_TYPES[kind].includes(file.type)) {
    throw { message: t('media.invalidType') };
  }
  if (file.size > maxBytes) {
    throw { message: t('media.tooLarge', { size: maxBytes / 1024 / 1024 }) };
  }
};

export const formatDuration = (ms: number) => {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

// sizeBytes is a bigint serialized as a string
export const formatBytes = (sizeBytes: string | null) => {
  if (sizeBytes == null) return '-';
  const bytes = Number(sizeBytes);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const mediaFileName = (storageKey: string) =>
  storageKey.split('/').pop() ?? storageKey;
