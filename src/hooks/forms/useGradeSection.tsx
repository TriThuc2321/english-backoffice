import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
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
  const { mutate, isPending } = useCreateAssessment();

  // Reset only when another section opens: a refetch after a conflict must keep the teacher's input
  useEffect(() => {
    form.reset(toAssessmentFormValues(section));
    setHasConflict(false);
  }, [attemptSectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const values = useWatch({ control: form.control }) as AssessmentFormValues;
  const bands = previewBands(expectedEntries, values);

  const onSubmit = form.handleSubmit((data) =>
    mutate(
      toCreateAssessmentPayload(attemptSectionId, section.revision, data),
      {
        onSuccess: () => {
          setHasConflict(false);
          form.reset(data);
        },
        onError: (err: ApiError) =>
          setHasConflict(err?.code === ASSESSMENT_ERROR.REVISION_CONFLICT),
      },
    ),
  );

  return { form, onSubmit, isPending, bands, hasConflict };
};

export default useGradeSection;
