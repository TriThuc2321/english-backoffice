import { useTranslation } from 'react-i18next';

import { QUESTION_TYPES } from '@/constants/questionTypes';

import { FigureImage } from '../figures';
import {
  AudioBar,
  Choices,
  formatRange,
  Hint,
  Prompt,
  QRow,
  Transcript,
  usePreview,
} from '../parts';

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five'];

export const McqView = () => {
  const { sample } = usePreview();
  return (
    <>
      <AudioBar length={sample.audio} mediaId={sample.audioMediaId} />
      {sample.questions.map((q) => (
        <QRow key={q.n} n={q.n}>
          <Prompt>{q.prompt}</Prompt>
          <Choices n={q.n} options={q.content?.options ?? []} />
        </QRow>
      ))}
    </>
  );
};

export const MultiView = () => {
  const { t } = useTranslation();
  const { sample } = usePreview();
  return sample.questions.map((q) => {
    const count = (q.nTo ?? q.n) - q.n + 1;
    return (
      <QRow key={q.n} n={q.n} label={formatRange(q)}>
        <Prompt>{q.prompt}</Prompt>
        <Hint>
          {t('tests.editor.typePreview.chooseN', {
            count: NUM_WORDS[count]?.toUpperCase() ?? count,
          })}
        </Hint>
        <Choices
          n={q.n}
          options={q.content?.options ?? []}
          multi
          limit={count}
        />
      </QRow>
    );
  });
};

export const JudgeView = () => {
  const { sample } = usePreview();
  const options = (QUESTION_TYPES[sample.type].fixedKeys ?? []).map((key) => ({
    key,
    text: key,
  }));
  return sample.questions.map((q) => (
    <QRow key={q.n} n={q.n}>
      <Prompt>{q.prompt}</Prompt>
      <Choices n={q.n} options={options} variant="pills" />
    </QRow>
  ));
};

export const PhotoView = () => {
  const { t } = useTranslation();
  const { sample } = usePreview();
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <FigureImage figure={sample.figure} mediaId={sample.imageMediaId} />
      <div>
        <AudioBar length={sample.audio} mediaId={sample.audioMediaId} />
        {sample.questions.map((q) => (
          <QRow key={q.n} n={q.n}>
            <FigureImage mediaId={q.imageMediaId} className="mb-2 max-w-sm" />
            <AudioBar mediaId={q.audioMediaId} />
            <Hint>{t('tests.editor.typePreview.photoHint')}</Hint>
            <Choices
              n={q.n}
              options={q.content?.options ?? []}
              variant="bubbles"
            />
          </QRow>
        ))}
        <Transcript text={sample.transcript} />
      </div>
    </div>
  );
};

export const QuestionResponseView = () => {
  const { sample } = usePreview();
  return (
    <>
      <AudioBar length={sample.audio} mediaId={sample.audioMediaId} />
      {sample.questions.map((q) => (
        <QRow key={q.n} n={q.n}>
          <AudioBar mediaId={q.audioMediaId} />
          <Prompt>{q.prompt}</Prompt>
          <Choices
            n={q.n}
            options={q.content?.options ?? []}
            variant="bubbles"
          />
        </QRow>
      ))}
      <Transcript text={sample.transcript} />
    </>
  );
};

// TOEIC Part 6: picking an option fills the numbered gap in the passage
export const TextCompletionView = () => {
  const { sample, answers } = usePreview();
  const parts = (sample.passageText ?? '').split(/\[\[(\d+)\]\]/);

  const gap = (n: number) => {
    const q = sample.questions.find((x) => x.n === n);
    const picked = q?.content?.options?.find((o) => o.key === answers[n]);
    return (
      <span className="border-accent text-accent mx-0.5 inline-block min-w-12 border-b-2 px-1 text-center font-semibold">
        {picked?.text ?? n}
      </span>
    );
  };

  return (
    <>
      <div className="border-border rounded-field mb-4 border p-4 text-sm leading-7 whitespace-pre-line">
        {parts.map((part, i) =>
          i % 2 ? <span key={i}>{gap(Number(part))}</span> : part,
        )}
      </div>
      {sample.questions.map((q) => (
        <QRow key={q.n} n={q.n}>
          <Choices n={q.n} options={q.content?.options ?? []} />
        </QRow>
      ))}
    </>
  );
};
