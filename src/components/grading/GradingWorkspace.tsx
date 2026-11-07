import { Card } from '@heroui/react';
import { useCallback, useRef } from 'react';
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
import PartReview from './PartReview';
import RevisionHistory from './RevisionHistory';

const GradingWorkspace = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const ability = useCan();
  const { data: section, isLoading, error, refetch } = useGetGradingSection(id);
  const retried = useRef(false);

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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Content className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="font-semibold">
            {formatPersonName(section.student)}
          </span>
          <span>{section.test.title}</span>
          <span>{t(`tests.skill.${section.skill}`)}</span>
          <span>
            {t('grading.field.submittedAt')}:{' '}
            {formatDateTime(
              section.submittedAt ?? undefined,
              'DD/MM/YYYY HH:mm',
            )}
          </span>
          <GradingStatusChip status={section.gradingStatus} />
          <span>
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
          <Card.Content className="flex flex-col gap-8">
            {section.parts.map((part) => (
              <PartReview
                key={part.partId}
                part={part}
                onAudioError={onAudioError}
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
