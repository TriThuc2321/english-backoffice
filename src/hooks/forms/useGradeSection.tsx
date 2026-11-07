import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch, type Resolver } from 'react-hook-form';

import type { AssessmentFormValues } from '@/schemas/assessment';
import type { ApiError } from '@/types/common';
import type { GradingSection } from '@/types/grading';

import { useCreateAssessment } from '@/hooks/apis/grading';
import {
  buildAssessmentSchema,
  toAssessmentFormValues,
  toCreateAssessmentPayload,
} from '@/schemas/assessment';
import { ASSESSMENT_ERROR } from '@/types/grading';
import { previewBands } from '@/utils/ieltsBand';

const useGradeSection = (section: GradingSection) => {
  const { attemptSectionId, expectedEntries } = section;
  const resolver = useMemo(
    () =>
      yupResolver(
        buildAssessmentSchema(expectedEntries),
      ) as unknown as Resolver<AssessmentFormValues>,
    [expectedEntries],
  );
  const form = useForm<AssessmentFormValues>({
    resolver,
    defaultValues: toAssessmentFormValues(section),
  });
  const [hasConflict, setHasConflict] = useState(false);
  // The revision the teacher's input is based on; a background refetch must not move it, or a stale save would skip the 409
  const [baseRevision, setBaseRevision] = useState(section.revision);
  const adoptNextRevision = useRef(false);
  const { mutate, isPending } = useCreateAssessment();

  // Reset only when another section opens: a refetch after a conflict must keep the teacher's input
  useEffect(() => {
    form.reset(toAssessmentFormValues(section));
    setHasConflict(false);
    setBaseRevision(section.revision);
  }, [attemptSectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!adoptNextRevision.current) return;
    adoptNextRevision.current = false;
    setBaseRevision(section.revision);
  }, [section.revision]);

  const values = useWatch({ control: form.control }) as AssessmentFormValues;
  const bands = previewBands(expectedEntries, values);

  const onSubmit = form.handleSubmit((data) =>
    mutate(toCreateAssessmentPayload(attemptSectionId, baseRevision, data), {
      onSuccess: (assessment) => {
        setHasConflict(false);
        setBaseRevision(assessment.revision);
        form.reset(data);
      },
      onError: (err: ApiError) => {
        const isConflict = err?.code === ASSESSMENT_ERROR.REVISION_CONFLICT;
        setHasConflict(isConflict);
        if (!isConflict) return;
        // The section was refetched before this ran when it already holds a newer revision
        if (section.revision > baseRevision) setBaseRevision(section.revision);
        else adoptNextRevision.current = true;
      },
    }),
  );

  return { form, onSubmit, isPending, bands, hasConflict, baseRevision };
};

export default useGradeSection;
