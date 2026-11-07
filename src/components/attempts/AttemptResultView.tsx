import { Card } from '@heroui/react';
import dayjs from 'dayjs';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { ApiError } from '@/types/common';

import Loader from '@/components/shared/Loader';
import {
  useGetAttemptContent,
  useGetAttemptResult,
} from '@/hooks/apis/attempts';
import { ATTEMPT_ERROR } from '@/types/attempt';
import { buildResultView } from '@/utils/attemptResult';
import { formatPersonName } from '@/utils/common';
import { formatDateTime } from '@/utils/datetime';

import AttemptStatusChip from './AttemptStatusChip';
import ResultReview from './ResultReview';
import ScoreSummary from './ScoreSummary';

const AttemptResultView = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const { data: result, isLoading, error, refetch } = useGetAttemptResult(id);
  const { data: content, isLoading: isContentLoading } = useGetAttemptContent(
    id,
    !!result,
  );
  const retried = useRef(false);
  const [sectionId, setSectionId] = useState<number | null>(null);

  // Recording URLs are presigned and expire; fetch fresh ones once
  const onAudioError = useCallback(() => {
    if (retried.current) return;
    retried.current = true;
    refetch();
  }, [refetch]);

  const view = useMemo(
    () => (result ? buildResultView(result, content ?? null) : null),
    [result, content],
  );

  if (isLoading || (result && isContentLoading)) return <Loader />;
  if (!result || !view) {
    const apiError = error as ApiError | null;
    const message =
      apiError?.code === ATTEMPT_ERROR.NOT_GRADED
        ? t('attempts.result.inProgress')
        : apiError?.statusCode === 404
          ? t('attempts.result.notFound')
          : t('attempts.result.loadError');
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <p>{message}</p>
        <Link to="/attempts" className="text-accent hover:underline">
          {t('attempts.result.backToList')}
        </Link>
      </div>
    );
  }

  const { attempt, student } = result;
  const activeSectionId = sectionId ?? view.sections[0]?.sectionId ?? null;
  const minutes = attempt.submittedAt
    ? dayjs(attempt.submittedAt).diff(attempt.startedAt, 'minute')
    : null;
  const sameDay =
    attempt.submittedAt &&
    dayjs(attempt.submittedAt).isSame(attempt.startedAt, 'day');

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Content className="flex flex-row flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">
                {attempt.test.title.trim() || t('attempts.result.untitledTest')}
              </h2>
              <AttemptStatusChip status={attempt.status} />
            </div>
            <p className="text-muted text-sm">
              {t(`tests.examType.${attempt.test.examType}`)} ·{' '}
              {t(`attempts.mode.${attempt.mode}`)}
            </p>
            <p className="text-sm tabular-nums">
              {formatDateTime(attempt.startedAt, 'DD/MM/YYYY HH:mm')}
              {attempt.submittedAt && (
                <>
                  {' → '}
                  {formatDateTime(
                    attempt.submittedAt,
                    sameDay ? 'HH:mm' : 'DD/MM/YYYY HH:mm',
                  )}
                  <span className="text-muted">
                    {' · '}
                    {minutes === 0
                      ? t('attempts.result.durationUnderMinute')
                      : t('attempts.result.duration', { count: minutes ?? 0 })}
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 text-sm sm:items-end">
            <span className="font-semibold">{formatPersonName(student)}</span>
            {student.email && (
              <span className="text-muted text-xs">{student.email}</span>
            )}
            <Link
              to={`/attempts?userId=${student.id}`}
              className="text-accent text-sm hover:underline"
            >
              {t('attempts.result.otherAttempts')}
            </Link>
          </div>
        </Card.Content>
      </Card>

      <ScoreSummary
        view={view}
        activeSectionId={activeSectionId}
        onSelectSection={setSectionId}
      />
      <ResultReview
        sections={view.sections}
        sectionId={activeSectionId}
        onSectionChange={setSectionId}
        onAudioError={onAudioError}
      />
    </div>
  );
};

export default AttemptResultView;
