import { useTranslation } from 'react-i18next';

import type { GradingPart, GradingQuestion } from '@/types/grading';

type PartReviewProps = {
  part: GradingPart;
  onAudioError: () => void;
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

const PartReview = ({ part, onAudioError }: PartReviewProps) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-4">
      <header>
        {part.title && <h3 className="font-semibold">{part.title}</h3>}
        {part.instruction && (
          <p className="text-muted text-sm">{part.instruction}</p>
        )}
      </header>

      {part.questions.map((q) => (
        <article key={q.questionId} className="flex flex-col gap-3">
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
            <details className="border-border rounded-lg border p-3 text-sm">
              <summary className="cursor-pointer font-medium">
                {t('grading.screen.sampleAnswer')}
              </summary>
              {q.sample && (
                <p className="mt-2 whitespace-pre-wrap">{q.sample}</p>
              )}
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
            </details>
          )}
        </article>
      ))}
    </section>
  );
};

export default PartReview;
