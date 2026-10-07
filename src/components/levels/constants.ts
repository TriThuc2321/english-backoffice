import { LevelStatus } from '@/types/level';

export const statusColorMap: Record<
  LevelStatus,
  'success' | 'warning' | 'default'
> = {
  [LevelStatus.ACTIVE]: 'success',
  [LevelStatus.INACTIVE]: 'warning',
  [LevelStatus.DELETED]: 'default',
};
