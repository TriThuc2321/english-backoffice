import { Card } from '@heroui/react';
import { useCallback, useMemo, useRef } from 'react';
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Content className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="flex flex-col">
            <span className="font-semibold">{formatPersonName(student)}</span>
            {student.email && (
              <span className="text-muted text-xs">{student.email}</span>
            )}
          </span>
          <span className="flex flex-col">
            <span>{attempt.test.title}</span>
            <span className="text-muted text-xs">
              {t(`tests.examType.${attempt.test.examType}`)} ·{' '}
              {t(`attempts.mode.${attempt.mode}`)}
            </span>
          </span>
          <span>
            {t('attempts.field.startedAt')}:{' '}
            {formatDateTime(attempt.startedAt, 'DD/MM/YYYY HH:mm')}
          </span>
          <span>
            {t('attempts.field.submittedAt')}:{' '}
            {formatDateTime(
              attempt.submittedAt ?? undefined,
              'DD/MM/YYYY HH:mm',
            )}
          </span>
          <AttemptStatusChip status={attempt.status} />
          <Link
            to={`/attempts?userId=${student.id}`}
            className="text-accent ml-auto hover:underline"
          >
            {t('attempts.result.otherAttempts')}
          </Link>
        </Card.Content>
      </Card>

      <ScoreSummary view={view} />
      <ResultReview sections={view.sections} onAudioError={onAudioError} />
    </div>
  );
};

export default AttemptResultView;
