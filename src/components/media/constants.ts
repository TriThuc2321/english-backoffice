import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';

export const kindColorMap: Record<MediaKind, 'accent' | 'success'> = {
  [MediaKind.AUDIO]: 'accent',
  [MediaKind.IMAGE]: 'success',
};

export const scopeColorMap: Record<MediaScope, 'warning' | 'default'> = {
  [MediaScope.TEST]: 'warning',
  [MediaScope.AVATAR]: 'default',
};

// Where the owner of each scope can be opened
export const ownerHref = (scope: MediaScope, ownerId: string) =>
  scope === MediaScope.TEST ? `/tests/${ownerId}/edit` : `/users/${ownerId}`;
