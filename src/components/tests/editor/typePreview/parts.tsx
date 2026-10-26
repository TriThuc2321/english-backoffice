import { cn, Skeleton } from '@heroui/react';
import { createContext, Fragment, useContext, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlay } from 'react-icons/lu';

import { useGetMediaById } from '@/hooks/apis/media';

import type { PreviewAnswers, QuestionResult } from './grading';
import type {
  Passage,
  SampleOption,
  SampleQuestion,
  TypeSample,
} from './samples';

type PreviewContextValue = {
  sample: TypeSample;
  answers: PreviewAnswers;
  setAnswer: (n: number, value: string | string[]) => void;
  checked: boolean;
  results: Record<number, QuestionResult>;
};

export const PreviewContext = createContext<PreviewContextValue | null>(null);

export const usePreview = () => {
  const value = useContext(PreviewContext);
  if (!value) throw new Error('usePreview must be used inside PreviewContext');
  return value;
};

const useResult = (n: number) => {
  const { checked, results } = usePreview();
  return checked ? results[n] : undefined;
};

const resultTone = (result?: QuestionResult) =>
  result && (result.ok ? 'border-success' : 'border-danger');

export const formatRange = (q: SampleQuestion) =>
  q.nTo && q.nTo !== q.n ? `${q.n}–${q.nTo}` : `${q.n}`;

export const mmss = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

// Splits text on {{n}} placeholders and renders each one with `blank`
export const fillTemplate = (
  text: string,
  blank: (n: number) => ReactNode,
): ReactNode[] =>
  text
    .split(/\{\{(\d+)\}\}/)
    .map((part, i) =>
      i % 2 ? (
        <Fragment key={i}>{blank(Number(part))}</Fragment>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );

export const Feedback = ({ n }: { n: number }) => {
  const { t } = useTranslation();
  const result = useResult(n);
  if (!result) return null;

  if (result.ok) {
    return (
      <span className="text-success ml-2 text-sm font-semibold">
        {t('tests.editor.typePreview.correct')}
      </span>
    );
  }
  return (
    <span className="text-danger ml-2 text-sm">
      {result.hits != null &&
        t('tests.editor.typePreview.hits', { count: result.hits })}{' '}
      {result.overLimit && t('tests.editor.typePreview.overLimit')}{' '}
      {t('tests.editor.typePreview.expected', { answer: result.expected })}
    </span>
  );
};

type QRowProps = { n: number; label?: string; children: ReactNode };

export const QRow = ({ n, label, children }: QRowProps) => {
  const result = useResult(n);
  return (
    <div
      className={cn(
        'rounded-field mb-1.5 grid grid-cols-[auto_1fr] gap-2.5 border border-transparent p-2',
        resultTone(result),
      )}
    >
      <QNum>{label ?? n}</QNum>
      <div className="min-w-0">
        {children}
        <Feedback n={n} />
      </div>
    </div>
  );
};

export const QNum = ({ children }: { children: ReactNode }) => (
  <span className="bg-accent-soft text-accent-soft-foreground rounded-field grid h-6.5 min-w-7 place-items-center px-1.5 text-[13px] font-bold">
    {children}
  </span>
);

export const Prompt = ({ children }: { children: ReactNode }) => (
  <p className="text-foreground mt-0.5 mb-2 font-medium">{children}</p>
);

export const Hint = ({ children }: { children: ReactNode }) => (
  <p className="text-muted -mt-1 mb-2 text-sm">{children}</p>
);

const fieldClass =
  'border-border bg-surface rounded-field border px-2 py-0.5 text-sm outline-none focus:border-accent';

// Inline gap: number badge + text box (or key dropdown when options are given)
export const Blank = ({
  n,
  options,
}: {
  n: number;
  options?: SampleOption[];
}) => {
  const { t } = useTranslation();
  const { answers, setAnswer } = usePreview();
  const result = useResult(n);
  const value = (answers[n] as string | undefined) ?? '';
  const label = t('tests.editor.typePreview.answerLabel', { n });

  return (
    <span className="mx-0.5 inline-flex items-center gap-1 align-baseline">
      <b className="text-sm">{n}</b>
      {options ? (
        <select
          aria-label={label}
          className={cn(fieldClass, resultTone(result))}
          value={value}
          onChange={(e) => setAnswer(n, e.target.value)}
        >
          <option value="" />
          {options.map((o) => (
            <option key={o.key} value={o.key}>
              {o.key}
            </option>
          ))}
        </select>
      ) : (
        <input
          aria-label={label}
          autoComplete="off"
          spellCheck={false}
          className={cn(fieldClass, 'w-32', resultTone(result))}
          value={value}
          onChange={(e) => setAnswer(n, e.target.value)}
        />
      )}
      {result && !result.ok && (
        <span className="text-danger text-xs">({result.expected})</span>
      )}
    </span>
  );
};

export const KeySelect = ({
  n,
  options,
}: {
  n: number;
  options: SampleOption[];
}) => {
  const { t } = useTranslation();
  const { answers, setAnswer } = usePreview();
  return (
    <select
      aria-label={t('tests.editor.typePreview.answerLabel', { n })}
      className={fieldClass}
      value={(answers[n] as string | undefined) ?? ''}
      onChange={(e) => setAnswer(n, e.target.value)}
    >
      <option value="" />
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.key}
        </option>
      ))}
    </select>
  );
};

export const TextAnswer = ({ n }: { n: number }) => {
  const { t } = useTranslation();
  const { answers, setAnswer } = usePreview();
  return (
    <input
      aria-label={t('tests.editor.typePreview.answerLabel', { n })}
      autoComplete="off"
      className="border-muted w-full max-w-72 border-b-[1.5px] bg-transparent px-1 py-0.5 outline-none"
      value={(answers[n] as string | undefined) ?? ''}
      onChange={(e) => setAnswer(n, e.target.value)}
    />
  );
};

type ChoicesProps = {
  n: number;
  options: SampleOption[];
  multi?: boolean;
  // limit for multi: further boxes are disabled once reached
  limit?: number;
  variant?: 'list' | 'pills' | 'bubbles';
};

export const Choices = ({
  n,
  options,
  multi,
  limit,
  variant = 'list',
}: ChoicesProps) => {
  const { sample, answers, setAnswer } = usePreview();
  const value = answers[n];
  const picked = Array.isArray(value) ? value : [];

  const toggle = (key: string) => {
    if (!multi) return setAnswer(n, key);
    setAnswer(
      n,
      picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key],
    );
  };

  return (
    <div
      className={cn(
        variant === 'list' ? 'flex flex-col gap-1' : 'flex flex-wrap gap-2',
      )}
    >
      {options.map((o) => {
        const isChecked = multi ? picked.includes(o.key) : value === o.key;
        const isDisabled =
          multi && !isChecked && limit != null && picked.length >= limit;
        return (
          <label
            key={o.key}
            className={cn(
              'rounded-field flex cursor-pointer items-center gap-2',
              variant === 'list' && 'hover:bg-default px-2 py-1',
              variant === 'pills' &&
                'border-border border px-3 py-1 text-sm font-semibold',
              variant === 'bubbles' &&
                'border-border grid size-10 place-items-center rounded-full border font-bold',
              variant !== 'list' &&
                isChecked &&
                'border-accent bg-accent-soft text-accent-soft-foreground',
              isDisabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={`${sample.id}-${n}`}
              value={o.key}
              checked={isChecked}
              disabled={isDisabled}
              onChange={() => toggle(o.key)}
              className={cn('accent-accent', variant !== 'list' && 'sr-only')}
            />
            {variant === 'list' ? (
              <>
                <span className="border-border grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold">
                  {o.key}
                </span>
                {o.text && <span>{o.text}</span>}
              </>
            ) : (
              <span>{o.text && variant === 'pills' ? o.text : o.key}</span>
            )}
          </label>
        );
      })}
    </div>
  );
};

export const OptionsBox = ({
  title,
  options,
}: {
  title?: string;
  options: SampleOption[];
}) => (
  <div className="border-border bg-default/40 rounded-field mb-3 border p-3">
    {title && <h5 className="mb-1.5 text-sm font-bold">{title}</h5>}
    <ol className="flex flex-col gap-0.5 text-sm">
      {options.map((o) => (
        <li key={o.key}>
          <b className="text-accent mr-2 inline-block min-w-6">{o.key}</b>
          {o.text}
        </li>
      ))}
    </ol>
  </div>
);

type MediaAudioProps = {
  mediaId: number;
  startMs?: number | null;
  endMs?: number | null;
};

export const MediaAudio = ({ mediaId, startMs, endMs }: MediaAudioProps) => {
  const { t } = useTranslation();
  const { data: media } = useGetMediaById(mediaId);
  if (!media) return <Skeleton className="mb-3 h-10 rounded-full" />;

  const range =
    startMs != null || endMs != null
      ? `#t=${(startMs ?? 0) / 1000}${endMs != null ? `,${endMs / 1000}` : ''}`
      : '';
  return (
    <audio
      controls
      preload="metadata"
      aria-label={t('tests.editor.typePreview.audio')}
      src={`${media.url}${range}`}
      className="mb-3 w-full"
    />
  );
};

type AudioBarProps = { length?: string; mediaId?: number };

// Static stand-in for the audio player unless a real media id is given
export const AudioBar = ({ length, mediaId }: AudioBarProps) => {
  const { t } = useTranslation();
  if (mediaId) return <MediaAudio mediaId={mediaId} />;
  if (!length) return null;
  return (
    <div className="bg-default mb-3 flex items-center gap-3 rounded-full px-3 py-1.5">
      <span
        className="bg-accent text-accent-foreground grid size-7 place-items-center rounded-full"
        aria-label={t('tests.editor.typePreview.audio')}
      >
        <LuPlay className="size-3.5" />
      </span>
      <span className="bg-border h-1 flex-1 rounded-full" />
      <small className="text-muted tabular-nums">0:00 / {length}</small>
    </div>
  );
};

export const PassagePane = ({
  passage,
  className,
}: {
  passage: Passage;
  className?: string;
}) => (
  <div
    className={cn(
      'border-border max-h-[460px] overflow-y-auto border-b p-4 text-sm leading-relaxed md:border-r md:border-b-0',
      className,
    )}
  >
    <h4 className="mb-2 font-bold">{passage.title}</h4>
    {passage.paragraphs.map(([letter, text]) => (
      <p key={letter} className="mb-2.5">
        <span className="bg-accent-soft text-accent-soft-foreground mr-1.5 inline-grid size-5 place-items-center rounded text-xs font-bold">
          {letter}
        </span>
        {text}
      </p>
    ))}
  </div>
);

export const Transcript = ({ text }: { text?: string }) => {
  const { t } = useTranslation();
  if (!text) return null;
  return (
    <details className="border-border rounded-field mt-3 border border-dashed p-3 text-sm">
      <summary className="text-muted cursor-pointer">
        {t('tests.editor.typePreview.transcript')}
      </summary>
      <p className="mt-2 whitespace-pre-line">{text}</p>
    </details>
  );
};

export const SampleAnswerBox = ({ q }: { q: SampleQuestion }) => {
  const { t } = useTranslation();
  const { checked } = usePreview();
  if (!checked) return null;
  const { sample, rubric } = q.answer;
  return (
    <div className="bg-success/10 border-success rounded-field mt-3 border-l-4 p-3 text-sm whitespace-pre-line">
      <b>{t('tests.editor.typePreview.sampleAnswer')}</b>
      {'\n'}
      {sample}
      {rubric && (
        <>
          {'\n\n'}
          <b>{t('tests.editor.typePreview.rubric')}</b>
          {Object.entries(rubric).map(([k, v]) => `\n• ${k}: ${v}`)}
        </>
      )}
    </div>
  );
};
