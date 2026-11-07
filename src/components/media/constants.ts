import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

export const kindColorMap: Record<MediaKind, 'accent' | 'success'> = {
  [MediaKind.AUDIO]: 'accent',
  [MediaKind.IMAGE]: 'success',
};

export const scopeColorMap: Record<
  MediaScope,
  'warning' | 'default' | 'accent'
> = {
  [MediaScope.TEST]: 'warning',
  [MediaScope.AVATAR]: 'default',
  [MediaScope.LIBRARY]: 'accent',
  [MediaScope.ATTEMPT]: 'default',
};

// Where the owner of each scope can be opened
export const ownerHref = (
  scope: MediaScope,
  ownerId: string,
): string | null => {
  if (scope === MediaScope.TEST) return `/tests/${ownerId}/edit`;
  if (scope === MediaScope.AVATAR) return `/users/${ownerId}`;
  return null;
};
