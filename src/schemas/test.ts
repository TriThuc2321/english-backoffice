import * as yup from 'yup';

import { IELTSSkill, PublishStatus, TestType } from '@/types/test';

import { VALIDATION_MESSAGE } from './message';

export const createEditTestSchema = yup.object().shape({
  title: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  code: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  skill: yup.string<IELTSSkill>().oneOf(Object.values(IELTSSkill)).optional(),
  type: yup.string<TestType>().oneOf(Object.values(TestType)).optional(),
  band: yup.string().max(50).optional(),
  durationMin: yup.number().min(1).optional(),
  totalQuestions: yup.number().min(1).optional(),
  publishStatus: yup
    .mixed<PublishStatus>()
    .oneOf(Object.values(PublishStatus))
    .default(PublishStatus.DRAFT),
});

export type CreateEditTestFormData = {
  title: string;
  code: string;
  skill?: IELTSSkill;
  type?: TestType;
  band?: string;
  durationMin?: number;
  totalQuestions?: number;
  publishStatus?: PublishStatus;
};
