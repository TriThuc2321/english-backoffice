import type { SyntheticEvent } from 'react';

import { useTranslation } from 'react-i18next';
import { LuChevronRight } from 'react-icons/lu';

import type { GradingPart, GradingQuestion } from '@/types/grading';

type PartReviewProps = {
  part: GradingPart;
  onAudioError: () => void;
  answeredOnly?: boolean;
};

export const isAnswered = ({ response }: GradingQuestion) =>
  !!(response?.audioUrl || response?.text?.trim());

// Browser-recorded WebM has no duration header; seeking to the end makes the browser compute it
const resolveDuration = (e: SyntheticEvent<HTMLAudioElement>) => {
  const audio = e.currentTarget;
  if (audio.duration !== Infinity) return;
  audio.addEventListener(
    'timeupdate',
    () => {
      audio.currentTime = 0;
    },
    { once: true },
  );
  audio.currentTime = Number.MAX_SAFE_INTEGER;
};

const StudentWork = ({
  question,
  onAudioError,
}: {
  question: GradingQuestion;
  onAudioError: () => void;
}) => {
  const { t } = useTranslation();
  const { response } = question;

  if (response?.audioUrl) {
    return (
      <audio
        controls
        preload="metadata"
        src={response.audioUrl}
        onError={onAudioError}
        onLoadedMetadata={resolveDuration}
        className="w-full"
      />
    );
  }
  if (response?.text?.trim()) {
    return (
      <div className="flex flex-col gap-1">
        <p className="bg-default rounded-lg p-3 text-sm whitespace-pre-wrap">
          {response.text}
        </p>
        {response.wordCount != null && (
          <span className="text-muted text-xs">
            {t('grading.screen.words', { count: response.wordCount })}
          </span>
        )}
      </div>
    );
  }
  return (
    <p className="text-muted text-sm italic">
      {t('grading.screen.noResponse')}
    </p>
  );
};

const PartReview = ({ part, onAudioError, answeredOnly }: PartReviewProps) => {
  const { t } = useTranslation();
  const questions = answeredOnly
    ? part.questions.filter(isAnswered)
    : part.questions;

  if (questions.length === 0) return null;

  return (
    <section className="border-border flex flex-col gap-5 border-t pt-6 first:border-t-0 first:pt-0">
      <header>
        {part.title && <h3 className="text-lg font-semibold">{part.title}</h3>}
        {part.instruction && (
          <p className="text-muted text-sm">{part.instruction}</p>
        )}
      </header>

      {questions.map((q) => (
        <article
          key={q.questionId}
          className={`flex flex-col gap-3 ${isAnswered(q) ? '' : 'opacity-60'}`}
        >
          {q.instruction && <p className="text-sm">{q.instruction}</p>}
          {q.prompt && (
            <p className="text-sm font-medium whitespace-pre-wrap">
              {q.numberFrom}. {q.prompt}
            </p>
          )}
          {q.imageUrl && (
            <img
              src={q.imageUrl}
              alt={t('grading.screen.promptImage')}
              className="max-h-80 rounded-lg object-contain"
            />
          )}
          {q.audioUrl && <audio controls preload="metadata" src={q.audioUrl} />}

          <div className="flex flex-col gap-1">
            <span className="text-muted text-xs font-semibold uppercase">
              {t('grading.screen.studentWork')}
            </span>
            <StudentWork question={q} onAudioError={onAudioError} />
          </div>

          {(q.sample || q.rubric) && (
            <details className="group text-sm">
              <summary className="text-muted hover:text-foreground inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium [&::-webkit-details-marker]:hidden">
                <LuChevronRight
                  aria-hidden
                  className="size-3.5 transition-transform group-open:rotate-90"
                />
                {t('grading.screen.sampleAnswer')}
              </summary>
              <div className="border-border mt-2 border-l-2 pl-3">
                {q.sample && <p className="whitespace-pre-wrap">{q.sample}</p>}
                {q.rubric && (
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                    {Object.entries(q.rubric).map(([code, text]) => (
                      <div key={code} className="contents">
                        <dt className="font-semibold">{code}</dt>
                        <dd>{String(text)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </details>
          )}
        </article>
      ))}
    </section>
  );
};

export default PartReview;
