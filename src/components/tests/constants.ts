import { IELTSSkill, PublishStatus, TestType } from '@/types/test';

export const skillColorMap: Record<
  IELTSSkill,
  'success' | 'warning' | 'danger' | 'accent' | 'default'
> = {
  [IELTSSkill.READING]: 'accent',
  [IELTSSkill.LISTENING]: 'success',
  [IELTSSkill.WRITING]: 'warning',
  [IELTSSkill.SPEAKING]: 'danger',
};

export const publishStatusColorMap: Record<
  PublishStatus,
  'success' | 'warning' | 'default'
> = {
  [PublishStatus.PUBLISHED]: 'success',
  [PublishStatus.DRAFT]: 'warning',
};

export const testTypeColorMap: Record<
  TestType,
  'success' | 'warning' | 'danger' | 'accent' | 'default'
> = {
  [TestType.PLACEMENT]: 'accent',
  [TestType.PROGRESS]: 'success',
  [TestType.MIDTERM]: 'warning',
  [TestType.FINAL]: 'danger',
  [TestType.PRACTICE]: 'default',
};
