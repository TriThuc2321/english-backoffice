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
