import { Card, Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { GradingExpectedEntry } from '@/types/grading';

import { useGetAssessments } from '@/hooks/apis/grading';
import { formatPersonName } from '@/utils/common';
import { formatDateTime } from '@/utils/datetime';

import { entryTitleKey } from './constants';

type RevisionHistoryProps = {
  attemptSectionId: string;
  expectedEntries: GradingExpectedEntry[];
};

const RevisionHistory = ({
  attemptSectionId,
  expectedEntries,
}: RevisionHistoryProps) => {
  const { t } = useTranslation();
  const { data: revisions = [] } = useGetAssessments(attemptSectionId);

  const taskOf = (partId: number | null) =>
    expectedEntries.find((e) => e.partId === partId)?.task ?? null;

  if (!revisions.length) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('grading.history.title')}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2">
        {revisions.map((revision, i) => {
          const label = t('grading.screen.revision', { n: revision.revision });
          return (
            <details
              key={revision.id}
              role="group"
              aria-label={label}
              className="border-border rounded-lg border p-3 text-sm"
            >
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold">{label}</span>
                {i === 0 && (
                  <Chip size="sm" variant="soft" color="success">
                    <Chip.Label>{t('grading.history.current')}</Chip.Label>
                  </Chip>
                )}
                <span>
                  {t('grading.field.band')}: <strong>{revision.band}</strong>
                </span>
                <span>{formatPersonName(revision.grader)}</span>
                <span className="text-muted">
                  {formatDateTime(revision.createdAt, 'DD/MM/YYYY HH:mm')}
                </span>
              </summary>

              <div className="mt-3 flex flex-col gap-3">
                {revision.entries.map((entry) => (
                  <div
                    key={entry.partId ?? 'speaking'}
                    className="flex flex-col gap-1"
                  >
                    <p className="font-medium">
                      <span>{t(entryTitleKey(taskOf(entry.partId)))}</span> ·{' '}
                      {entry.band}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(entry.criteria).map(([code, band]) => (
                        <Chip key={code} size="sm" variant="soft">
                          <Chip.Label>{`${code} ${band}`}</Chip.Label>
                        </Chip>
                      ))}
                    </div>
                    {entry.feedback && (
                      <p className="whitespace-pre-wrap">{entry.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </Card.Content>
    </Card>
  );
};

export default RevisionHistory;
