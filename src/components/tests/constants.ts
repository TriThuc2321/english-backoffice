import { ExamType, SkillType, TestStatus } from '@/types/test';

export const statusColorMap: Record<
  TestStatus,
  'success' | 'warning' | 'default'
> = {
  [TestStatus.PUBLISHED]: 'success',
  [TestStatus.DRAFT]: 'warning',
  [TestStatus.DELETED]: 'default',
};

// Skills allowed per exam type; each skill at most once per test
export const SKILLS_BY_EXAM_TYPE: Record<ExamType, SkillType[]> = {
  [ExamType.IELTS_ACADEMIC]: [
    SkillType.LISTENING,
    SkillType.READING,
    SkillType.WRITING,
    SkillType.SPEAKING,
  ],
  [ExamType.IELTS_GENERAL]: [
    SkillType.LISTENING,
    SkillType.READING,
    SkillType.WRITING,
    SkillType.SPEAKING,
  ],
  [ExamType.TOEIC_LR]: [SkillType.LISTENING, SkillType.READING],
  [ExamType.TOEIC_SW]: [SkillType.SPEAKING, SkillType.WRITING],
};

export const getSectionDefaults = (examType: ExamType) =>
  SKILLS_BY_EXAM_TYPE[examType].map((skill) => ({
    skill,
    enabled: true,
    durationMinutes: undefined,
  }));
