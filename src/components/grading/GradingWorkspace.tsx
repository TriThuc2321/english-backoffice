import { Card, Label, Switch } from '@heroui/react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { ApiError } from '@/types/common';

import Loader from '@/components/shared/Loader';
import { useCan } from '@/configs/casl/can.config';
import { useGetGradingSection } from '@/hooks/apis/grading';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatPersonName } from '@/utils/common';
import { formatDateTime } from '@/utils/datetime';

import AssessmentForm from './AssessmentForm';
import GradingStatusChip from './GradingStatusChip';
import PartReview, { isAnswered } from './PartReview';
import RevisionHistory from './RevisionHistory';

const Meta = ({ label, value }: { label: string; value: string }) => (
  <span>
    <span className="text-muted">{label}:</span> {value}
  </span>
);

const GradingWorkspace = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const ability = useCan();
  const { data: section, isLoading, error, refetch } = useGetGradingSection(id);
  const retried = useRef(false);
  const [answeredOnly, setAnsweredOnly] = useState(false);

  // Recording URLs are presigned and expire; fetch fresh ones once
  const onAudioError = useCallback(() => {
    if (retried.current) return;
    retried.current = true;
    refetch();
  }, [refetch]);

  if (isLoading) return <Loader />;
  if (!section) {
    const notFound = (error as ApiError | null)?.statusCode === 404;
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <p>
          {notFound
            ? t('grading.screen.notFound')
            : t('grading.screen.loadError')}
        </p>
        <Link to="/grading" className="text-accent hover:underline">
          {t('grading.screen.backToQueue')}
        </Link>
      </div>
    );
  }

  const canGrade = ability.can(
    PermissionAction.Create,
    SubjectName.Assessments,
  );
  const current = section.assessment;
  const questions = section.parts.flatMap((p) => p.questions);
  const answered = questions.filter(isAnswered).length;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Content className="flex flex-row flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="text-base font-semibold">
            {formatPersonName(section.student)}
          </span>
          <Meta label={t('grading.field.test')} value={section.test.title} />
          <Meta
            label={t('grading.field.skill')}
            value={t(`tests.skill.${section.skill}`)}
          />
          <Meta
            label={t('grading.field.submittedAt')}
            value={formatDateTime(
              section.submittedAt ?? undefined,
              'DD/MM/YYYY HH:mm',
            )}
          />
          <GradingStatusChip status={section.gradingStatus} />
          <span className="text-muted">
            {section.revision > 0
              ? t('grading.screen.revision', { n: section.revision })
              : t('grading.screen.notGraded')}
          </span>
          {current && (
            <span>
              {t('grading.screen.currentBand')}: <strong>{current.band}</strong>
            </span>
          )}
        </Card.Content>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
        <Card>
          <Card.Header className="flex-row flex-wrap items-center justify-between gap-2">
            <span className="text-sm" role="status">
              {t('grading.screen.answeredSummary', {
                answered,
                total: questions.length,
              })}
            </span>
            {answered < questions.length && answered > 0 && (
              <Switch
                size="sm"
                className="flex-row items-center gap-2"
                isSelected={answeredOnly}
                onChange={setAnsweredOnly}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Content>
                  <Label className="text-sm">
                    {t('grading.screen.answeredOnly')}
                  </Label>
                </Switch.Content>
              </Switch>
            )}
          </Card.Header>
          <Card.Content className="flex flex-col gap-6">
            {section.parts.map((part) => (
              <PartReview
                key={part.partId}
                part={part}
                onAudioError={onAudioError}
                answeredOnly={answeredOnly}
              />
            ))}
          </Card.Content>
        </Card>

        <div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
          <AssessmentForm section={section} readOnly={!canGrade} />
          {section.revision > 0 && (
            <RevisionHistory
              attemptSectionId={section.attemptSectionId}
              expectedEntries={section.expectedEntries}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GradingWorkspace;
