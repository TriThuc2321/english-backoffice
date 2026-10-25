import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

const MB = 1024 * 1024;

const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const MEDIA_CONTENT_TYPES: Record<MediaKind, string[]> = {
  [MediaKind.AUDIO]: [
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/wav',
  ],
  [MediaKind.IMAGE]: IMAGE_CONTENT_TYPES,
};

export const MEDIA_MAX_BYTES: Record<
  MediaScope,
  Partial<Record<MediaKind, number>>
> = {
  [MediaScope.TEST]: {
    [MediaKind.AUDIO]: 100 * MB,
    [MediaKind.IMAGE]: 10 * MB,
  },
  [MediaScope.AVATAR]: {
    [MediaKind.IMAGE]: 2 * MB,
  },
  [MediaScope.LIBRARY]: {
    [MediaKind.AUDIO]: 100 * MB,
    [MediaKind.IMAGE]: 10 * MB,
  },
};

export const AVATAR_CONTENT_TYPES = IMAGE_CONTENT_TYPES;
export const AVATAR_MAX_BYTES =
  MEDIA_MAX_BYTES[MediaScope.AVATAR][MediaKind.IMAGE]!;
