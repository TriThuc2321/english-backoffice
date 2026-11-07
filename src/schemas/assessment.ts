import * as yup from 'yup';

import type {
  CreateAssessmentPayload,
  GradingExpectedEntry,
  GradingSection,
} from '@/types/grading';

import { BAND_STEPS, FEEDBACK_MAX } from '@/constants/grading';

import { VALIDATION_MESSAGE } from './message';

export type AssessmentFormEntry = {
  partId: number | null;
  criteria: Record<string, number | null>;
  feedback: string;
};

export type AssessmentFormValues = { entries: AssessmentFormEntry[] };

const entrySchema = ({ criteria }: GradingExpectedEntry) =>
  yup.object({
    partId: yup.number().nullable().defined(),
    criteria: yup.object(
      Object.fromEntries(
        criteria.map((code) => [
          code,
          yup
            .number()
            .nullable()
            .required(VALIDATION_MESSAGE.CRITERION_REQUIRED)
            .oneOf(BAND_STEPS, VALIDATION_MESSAGE.BAND_INVALID),
        ]),
      ),
    ),
    feedback: yup
      .string()
      .defined()
      .max(FEEDBACK_MAX, VALIDATION_MESSAGE.FEEDBACK_TOO_LONG),
  });

// One schema per expected entry, so each row validates its own criterion codes
export const buildAssessmentSchema = (expected: GradingExpectedEntry[]) =>
  yup.object({
    entries: yup.tuple(
      expected.map(entrySchema) as unknown as [ReturnType<typeof entrySchema>],
    ),
  });

export const toAssessmentFormValues = (
  section: GradingSection,
): AssessmentFormValues => ({
  entries: section.expectedEntries.map((expected) => {
    const current = section.assessment?.entries.find(
      (e) => e.partId === expected.partId,
    );
    return {
      partId: expected.partId,
      criteria: Object.fromEntries(
        expected.criteria.map((code) => [
          code,
          current?.criteria[code] ?? null,
        ]),
      ),
      feedback: current?.feedback ?? '',
    };
  }),
});

export const toCreateAssessmentPayload = (
  id: string,
  revision: number,
  values: AssessmentFormValues,
): CreateAssessmentPayload => ({
  id,
  expectedRevision: revision,
  entries: values.entries.map(({ partId, criteria, feedback }) => {
    const text = feedback.trim();
    return {
      partId,
      criteria: criteria as Record<string, number>,
      ...(text && { feedback: text }),
    };
  }),
});
