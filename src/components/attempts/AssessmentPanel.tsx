import { Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuClipboardCheck } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { SectionResult } from '@/utils/attemptResult';

import { GradingStatusChip } from '@/components/grading';
import MyButton from '@/components/shared/Button';
import { PermissionAction, SubjectName } from '@/types/auth';
import { GradingStatus } from '@/types/grading';
import { CRITERIA_ORDER } from '@/utils/attemptResult';

const band = (value: number) => value.toFixed(1);

const AssessmentPanel = ({ section }: { section: SectionResult }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { assessment, gradingStatus } = section;

  if (!gradingStatus || gradingStatus === GradingStatus.AUTO_GRADED) {
    return null;
  }

  return (
    <Card>
      <Card.Header className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Card.Title>
            {assessment
              ? t('attempts.result.assessmentTitle', {
                  band: band(assessment.band),
                })
              : t('attempts.result.teacherAssessment')}
          </Card.Title>
          <GradingStatusChip status={gradingStatus} />
        </div>
        <MyButton
          I={PermissionAction.Read}
          a={SubjectName.Assessments}
          size="sm"
          variant="outline"
          onPress={() => navigate(`/grading/${section.attemptSectionId}`)}
        >
          <LuClipboardCheck className="size-4" />
          {gradingStatus === GradingStatus.PENDING
            ? t('attempts.action.grade')
            : t('attempts.action.openGrading')}
        </MyButton>
      </Card.Header>
      <Card.Content className="flex flex-col gap-5">
        {!assessment && (
          <p className="text-muted text-sm">
            {t('attempts.result.awaitingGrade')}
          </p>
        )}
        {assessment?.entries.map((entry) => (
          <div key={entry.partId ?? 'section'} className="flex flex-col gap-3">
            {entry.partId !== null && (
              <h3 className="font-semibold">
                {t('attempts.result.taskBand', {
                  task:
                    entry.partTitle ??
                    t('attempts.result.partFallback', {
                      order: entry.partOrder ?? 1,
                    }),
                  band: band(entry.band),
                })}
              </h3>
            )}
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,120px),1fr))] gap-2">
              {entry.criteria.map((c) => {
                const name = CRITERIA_ORDER.includes(c.code)
                  ? t(`grading.criteria.${c.code}`)
                  : c.code;
                return (
                  <div
                    key={c.code}
                    title={name}
                    className="bg-surface-secondary flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm"
                  >
                    <dt>
                      <abbr title={name} className="font-medium no-underline">
                        {c.code}
                      </abbr>
                      <span className="sr-only"> {name}</span>
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      {band(c.band)}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {entry.feedback && (
              <div className="rounded-lg border border-dashed px-3.5 py-3">
                <p className="text-muted text-xs">
                  {t('grading.screen.feedback')}
                </p>
                <p className="mt-0.5 text-sm whitespace-pre-line">
                  {entry.feedback}
                </p>
              </div>
            )}
          </div>
        ))}
      </Card.Content>
    </Card>
  );
};

export default AssessmentPanel;
