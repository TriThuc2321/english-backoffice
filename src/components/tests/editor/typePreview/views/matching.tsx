import { cn } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { FigureImage } from '../figures';
import {
  AudioBar,
  Feedback,
  Hint,
  KeySelect,
  OptionsBox,
  QRow,
  usePreview,
} from '../parts';

export const MatchingView = () => {
  const { t } = useTranslation();
  const { sample } = usePreview();
  const { options = [], allowReuse } = sample.group.content ?? {};
  const hasText = options.some((o) => o.text);

  return (
    <>
      {hasText && <OptionsBox title={sample.boxTitle} options={options} />}
      {allowReuse && <Hint>{t('tests.editor.typePreview.allowReuse')}</Hint>}
      {sample.questions.map((q) => (
        <QRow key={q.n} n={q.n}>
          <div className="flex flex-wrap items-center gap-2.5">
            <span>{q.prompt}</span>
            <KeySelect n={q.n} options={options} />
          </div>
        </QRow>
      ))}
    </>
  );
};

// Map / plan labelling: one row per place, one radio column per letter
export const MapView = () => {
  const { t } = useTranslation();
  const { sample, answers, setAnswer, checked, results } = usePreview();
  const options = sample.group.content?.options ?? [];

  return (
    <>
      <AudioBar length={sample.audio} mediaId={sample.audioMediaId} />
      <FigureImage
        figure={sample.figure}
        mediaId={sample.imageMediaId}
        className="mb-4 max-w-md"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-border border p-2" />
              {options.map((o) => (
                <th key={o.key} className="border-border border p-2">
                  {o.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sample.questions.map((q) => {
              const result = checked ? results[q.n] : undefined;
              return (
                <tr
                  key={q.n}
                  className={cn(
                    result && (result.ok ? 'bg-success/10' : 'bg-danger/10'),
                  )}
                >
                  <td className="border-border border p-2">
                    <b>{q.n}</b> {q.prompt}
                    <Feedback n={q.n} />
                  </td>
                  {options.map((o) => (
                    <td
                      key={o.key}
                      className="border-border border p-2 text-center"
                    >
                      <input
                        type="radio"
                        className="accent-accent"
                        name={`${sample.id}-${q.n}`}
                        aria-label={t('tests.editor.typePreview.answerLabel', {
                          n: `${q.n} ${o.key}`,
                        })}
                        checked={answers[q.n] === o.key}
                        onChange={() => setAnswer(q.n, o.key)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
