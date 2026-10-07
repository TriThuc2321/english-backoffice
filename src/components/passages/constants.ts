import { Status } from '@/types/common';

export const statusColorMap: Record<Status, 'success' | 'warning' | 'default'> =
  {
    [Status.PUBLISHED]: 'success',
    [Status.DRAFT]: 'warning',
    [Status.DELETED]: 'default',
  };
