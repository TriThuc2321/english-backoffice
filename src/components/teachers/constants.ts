import { SkillArea } from '@/types/teacher';

export const skillAreaColorMap: Record<
  SkillArea,
  'success' | 'warning' | 'danger' | 'accent' | 'default'
> = {
  [SkillArea.IELTS]: 'accent',
  [SkillArea.TOEIC]: 'danger',
  [SkillArea.SPEAKING]: 'success',
  [SkillArea.GRAMMAR]: 'warning',
  [SkillArea.GENERAL]: 'default',
};
