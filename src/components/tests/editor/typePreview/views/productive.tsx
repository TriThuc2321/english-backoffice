import { useTranslation } from 'react-i18next';
import { LuMic } from 'react-icons/lu';

import { QuestionType } from '@/types/test';

import type { SampleQuestion } from '../samples';

import { FigureImage } from '../figures';
import { wordCount } from '../grading';
import { Hint, mmss, Prompt, SampleAnswerBox, usePreview } from '../parts';

const Task = ({ children }: { children: React.ReactNode }) => (
  <div className="border-border mb-3 rounded-lg border p-4">{children}</div>
);

// Static recorder: shows the prep / response timing stored on the question
const Recorder = ({ q }: { q: SampleQuestion }) => {
  const { t } = useTranslation();
  const prep = q.content?.prepSeconds ?? 0;
  const response = q.content?.responseSeconds ?? 0;
  return (
    <div className="bg-default mt-3 flex flex-wrap items-center gap-3 rounded-lg px-3 py-2 text-sm">
      <span className="bg-danger text-danger-foreground grid size-8 place-items-center rounded-full">
        <LuMic className="size-4" />
      </span>
      <span>
        {t('tests.editor.typePreview.timing', {
          prep: mmss(prep),
          response: mmss(response),
        })}
      </span>
    </div>
  );
};

export const SpeakView = () => {
  const { t } = useTranslation();
  const { sample } = usePreview();
  const info = sample.group.content?.info;

  return (
    <>
      {info && (
        <div className="mb-4">
          {info.title && <h5 className="mb-1.5 font-bold">{info.title}</h5>}
          <table className="w-full border-collapse text-sm">
            <tbody>
              {info.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="border-border border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {sample.questions.map((q) => (
        <Task key={q.n}>
          <Hint>{t('tests.editor.typePreview.questionN', { n: q.n })}</Hint>
          {sample.figure && (
            <FigureImage figure={sample.figure} className="mb-2 max-w-md" />
          )}
          {sample.type === QuestionType.READ_ALOUD ? (
            <div className="bg-default/50 rounded-lg p-3 leading-7">
              {q.prompt}
            </div>
          ) : (
            q.prompt && (
              <Prompt>
                <b>{q.prompt}</b>
              </Prompt>
            )
          )}
          <Recorder q={q} />
          <SampleAnswerBox q={q} />
        </Task>
      ))}
    </>
  );
};

const WritePrompt = ({ q }: { q: SampleQuestion }) => {
  const { sample } = usePreview();
  const prompt = q.prompt ?? '';

  if (sample.type === QuestionType.WRITE_SENTENCE_PICTURE) {
    return (
      <div className="mb-2 flex flex-wrap gap-2">
        {prompt.split('/').map((word) => (
          <span
            key={word}
            className="bg-accent-soft text-accent-soft-foreground rounded-md px-3 py-1 font-semibold"
          >
            {word.trim()}
          </span>
        ))}
      </div>
    );
  }
  if (sample.email) {
    const [head, ...rest] = prompt.split('\n\n');
    return (
      <div className="border-border mb-2 rounded-lg border text-sm">
        <div className="border-border bg-default/50 border-b px-3 py-2 whitespace-pre-line">
          {head}
        </div>
        <div className="px-3 py-2 whitespace-pre-line">{rest.join('\n\n')}</div>
      </div>
    );
  }
  return (
    <Prompt>
      <b>{prompt}</b>
    </Prompt>
  );
};

export const WriteView = () => {
  const { t } = useTranslation();
  const { sample, answers, setAnswer } = usePreview();

  return sample.questions.map((q) => {
    const seconds = q.content?.responseSeconds;
    const value = (answers[q.n] as string | undefined) ?? '';
    return (
      <Task key={q.n}>
        <Hint>
          {t('tests.editor.typePreview.questionN', { n: q.n })}
          {seconds != null &&
            ` · ${t('tests.editor.typePreview.timeAllowed', { time: mmss(seconds) })}`}
        </Hint>
        {sample.figure && (
          <FigureImage figure={sample.figure} className="mb-2 max-w-sm" />
        )}
        <WritePrompt q={q} />
        <textarea
          rows={sample.rows ?? 4}
          aria-label={t('tests.editor.typePreview.answerLabel', { n: q.n })}
          placeholder={t('tests.editor.typePreview.typeAnswer')}
          className="border-border bg-surface focus:border-accent w-full rounded-lg border p-2 text-sm outline-none"
          value={value}
          onChange={(e) => setAnswer(q.n, e.target.value)}
        />
        <div className="text-muted mt-1 text-xs">
          {t('tests.editor.typePreview.words', { count: wordCount(value) })}
          {sample.minWords != null &&
            ` · ${t('tests.editor.typePreview.minWords', { count: sample.minWords })}`}
        </div>
        <SampleAnswerBox q={q} />
      </Task>
    );
  });
};
