import { GradingStatus } from '@/types/grading';

export const gradingStatusColorMap: Record<
  GradingStatus,
  'success' | 'warning' | 'default'
> = {
  [GradingStatus.PENDING]: 'warning',
  [GradingStatus.GRADED]: 'success',
  [GradingStatus.AUTO_GRADED]: 'default',
};

export const entryTitleKey = (task: 1 | 2 | null) =>
  task === 1
    ? 'grading.screen.task1'
    : task === 2
      ? 'grading.screen.task2'
      : 'grading.screen.speaking';
