import { PassageStatus } from '@/types/passage';

export const statusColorMap: Record<
  PassageStatus,
  'success' | 'warning' | 'default'
> = {
  [PassageStatus.PUBLISHED]: 'success',
  [PassageStatus.DRAFT]: 'warning',
  [PassageStatus.DELETED]: 'default',
};
