import { MediaKind } from '@/types/test';

export const MEDIA_CONTENT_TYPES: Record<MediaKind, string[]> = {
  [MediaKind.AUDIO]: [
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/webm',
    'audio/wav',
  ],
  [MediaKind.IMAGE]: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
};

export const MEDIA_MAX_BYTES: Record<MediaKind, number> = {
  [MediaKind.AUDIO]: 100 * 1024 * 1024,
  [MediaKind.IMAGE]: 10 * 1024 * 1024,
};
