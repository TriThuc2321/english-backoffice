import { Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { ResultView } from '@/utils/attemptResult';

import { isIelts } from '@/utils/attemptResult';

const ScoreSummary = ({ view }: { view: ResultView }) => {
  const { t } = useTranslation();
  const { total, skills } = view;

  return (
    <Card>
      <Card.Content className="flex flex-wrap gap-4">
        {total && (
          <div className="flex flex-[1_1_220px] flex-col justify-center gap-1 py-2 pr-6 pl-2">
            <p className="text-accent text-xs font-semibold tracking-[0.08em] uppercase">
              {total.kind === 'toeic'
                ? t('attempts.result.totalToeic')
                : total.estimate
                  ? t('attempts.result.totalIeltsEstimate')
                  : t('attempts.result.totalIelts')}
            </p>
            <p className="flex items-baseline gap-2">
              <span className="text-5xl leading-none font-extrabold tracking-tight">
                {total.kind === 'toeic' ? total.score : total.band.toFixed(1)}
              </span>
              <span className="text-muted text-lg">
                {t('attempts.result.outOf', { max: total.max })}
              </span>
            </p>
            {total.kind === 'ielts' && total.estimate && (
              <p className="text-muted mt-1 text-sm">
                {t('attempts.result.estimateNote')}
              </p>
            )}
          </div>
        )}
        <ul className="grid flex-[999_1_520px] grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3">
          {skills.map((s) => (
            <li
              key={s.sectionId}
              className="bg-surface-secondary flex flex-col gap-1 rounded-xl p-4"
            >
              <span className="text-sm font-semibold">
                {t(`tests.skill.${s.skill}`)}
              </span>
              <span className="text-3xl font-bold tabular-nums">
                {s.scaledScore === null
                  ? '—'
                  : isIelts(view.examType)
                    ? s.scaledScore.toFixed(1)
                    : s.scaledScore}
              </span>
              <span className="text-muted text-xs">
                {s.pending || s.scaledScore === null
                  ? t('attempts.result.gradingPending')
                  : s.rawScore === null || s.maxScore === null
                    ? t('attempts.result.gradedByTeacher')
                    : t('attempts.result.rawCorrect', {
                        correct: s.rawScore,
                        total: s.maxScore,
                      })}
              </span>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
};

export default ScoreSummary;
