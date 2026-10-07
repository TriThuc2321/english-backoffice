import * as yup from 'yup';

import { Gender } from '@/types/common';
import {
  ParentRelationship,
  StudentSegment,
  StudentStatus,
} from '@/types/student';

import { VALIDATION_MESSAGE } from './message';

const KID_SEGMENTS: StudentSegment[] = [
  StudentSegment.KIDS,
  StudentSegment.TEENS,
];

export const createEditStudentSchema = yup.object().shape({
  studentCode: yup.string().defined(),
  firstName: yup.string().required(VALIDATION_MESSAGE.REQUIRED),
  lastName: yup.string().defined(),
  segment: yup
    .mixed<StudentSegment>()
    .oneOf(Object.values(StudentSegment))
    .required(VALIDATION_MESSAGE.REQUIRED),
  status: yup
    .mixed<StudentStatus>()
    .oneOf(Object.values(StudentStatus))
    .required(VALIDATION_MESSAGE.REQUIRED),
  dob: yup.string().defined(),
  gender: yup
    .mixed<Gender>()
    .oneOf(Object.values(Gender))
    .nullable()
    .optional(),
  phone: yup.string().defined(),
  email: yup
    .string()
    .email(VALIDATION_MESSAGE.INVALID_EMAIL)
    .defined()
    .default(''),
  entryLevelCode: yup.string().defined(),
  note: yup.string().defined(),
  parentName: yup
    .string()
    .defined()
    .when('segment', {
      is: (segment: StudentSegment) => KID_SEGMENTS.includes(segment),
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRED),
      otherwise: (schema) => schema,
    }),
  parentPhone: yup
    .string()
    .defined()
    .when('segment', {
      is: (segment: StudentSegment) => KID_SEGMENTS.includes(segment),
      then: (schema) => schema.required(VALIDATION_MESSAGE.REQUIRED),
      otherwise: (schema) => schema,
    }),
  parentEmail: yup
    .string()
    .email(VALIDATION_MESSAGE.INVALID_EMAIL)
    .defined()
    .default(''),
  parentRelationship: yup
    .mixed<ParentRelationship>()
    .oneOf(Object.values(ParentRelationship))
    .nullable()
    .optional(),
});

export type CreateEditStudentFormData = yup.InferType<
  typeof createEditStudentSchema
>;
