import { GradingStatus } from '@/types/grading';

export const gradingStatusColorMap: Record<
  GradingStatus,
  'success' | 'warning' | 'default'
> = {
  [GradingStatus.PENDING]: 'warning',
  [GradingStatus.GRADED]: 'success',
  [GradingStatus.AUTO_GRADED]: 'default',
};
