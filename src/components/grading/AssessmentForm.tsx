import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  Card,
} from '@heroui/react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { GradingExpectedEntry, GradingSection } from '@/types/grading';

import MyButton from '@/components/shared/Button';
import { TextInput } from '@/components/tests/editor/fields';
import { FEEDBACK_MAX } from '@/constants/grading';
import { useGradeSection } from '@/hooks/forms';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatPersonName } from '@/utils/common';

import CriterionSelect from './CriterionSelect';

type AssessmentFormProps = {
  section: GradingSection;
  readOnly?: boolean;
};

const entryTitle = (entry: GradingExpectedEntry) =>
  entry.task === 1
    ? 'grading.screen.task1'
    : entry.task === 2
      ? 'grading.screen.task2'
      : 'grading.screen.speaking';

const BandStatus = ({
  label,
  band,
}: {
  label: string;
  band: number | null;
}) => (
  <p role="status" aria-label={label} className="text-sm">
    {label}: <strong>{band ?? '—'}</strong>
  </p>
);

const AssessmentForm = ({ section, readOnly }: AssessmentFormProps) => {
  const { t } = useTranslation();
  const { form, onSubmit, isPending, bands, hasConflict } =
    useGradeSection(section);
  const { control, formState } = form;
  const latest = section.assessment;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {section.expectedEntries.map((entry, i) => {
        const title = t(entryTitle(entry));
        const errors = formState.errors.entries?.[i];
        return (
          <Card
            key={entry.partId ?? 'speaking'}
            role="group"
            aria-label={title}
          >
            <Card.Header className="flex-row items-center justify-between">
              <Card.Title>{title}</Card.Title>
              <BandStatus
                label={t('grading.screen.entryBand', { name: title })}
                band={bands.entries[i]}
              />
            </Card.Header>
            <Card.Content className="grid gap-3 sm:grid-cols-2">
              {entry.criteria.map((code) => (
                <Controller
                  key={code}
                  control={control}
                  name={`entries.${i}.criteria.${code}`}
                  render={({ field }) => (
                    <CriterionSelect
                      label={t(`grading.criteria.${code}`, {
                        defaultValue: code,
                      })}
                      value={field.value ?? null}
                      onChange={field.onChange}
                      isDisabled={readOnly}
                      error={errors?.criteria?.[code]?.message}
                    />
                  )}
                />
              ))}
              <Controller
                control={control}
                name={`entries.${i}.feedback`}
                render={({ field }) => (
                  <TextInput
                    className="sm:col-span-2"
                    label={t('grading.screen.feedback')}
                    description={`${field.value.length} / ${FEEDBACK_MAX}`}
                    multiline
                    rows={4}
                    value={field.value}
                    onChange={field.onChange}
                    isDisabled={readOnly}
                    error={errors?.feedback?.message}
                  />
                )}
              />
            </Card.Content>
          </Card>
        );
      })}

      <BandStatus
        label={t('grading.screen.estimatedBand')}
        band={bands.section}
      />

      {hasConflict && latest && (
        <Alert status="warning">
          <AlertIndicator />
          <AlertContent>
            <AlertDescription>
              {t('grading.screen.conflictBanner', {
                name: formatPersonName(latest.grader),
                band: latest.band,
                revision: latest.revision,
              })}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {readOnly ? (
        <p className="text-muted text-sm">{t('grading.screen.readOnly')}</p>
      ) : (
        <MyButton
          I={PermissionAction.Create}
          a={SubjectName.Assessments}
          type="submit"
          variant="primary"
          isPending={isPending}
        >
          {section.revision > 0
            ? t('grading.screen.saveCorrection')
            : t('grading.screen.saveGrade')}
        </MyButton>
      )}
    </form>
  );
};

export default AssessmentForm;
