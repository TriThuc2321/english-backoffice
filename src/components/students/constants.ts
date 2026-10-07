import { StudentSegment } from '@/types/student';

export const segmentColorMap: Record<
  StudentSegment,
  'success' | 'warning' | 'danger' | 'accent' | 'default'
> = {
  [StudentSegment.KIDS]: 'accent',
  [StudentSegment.TEENS]: 'success',
  [StudentSegment.UNI]: 'warning',
  [StudentSegment.ADULT]: 'danger',
};
