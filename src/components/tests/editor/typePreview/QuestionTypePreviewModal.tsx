import { Button, cn, Modal } from '@heroui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCode, LuInfo } from 'react-icons/lu';

import type { QuestionType } from '@/types/test';

import { TextInput } from '../fields';
import { gradeSample, type PreviewAnswers } from './grading';
import { PassagePane, PreviewContext } from './parts';
import { findSample, SAMPLES, storedShape, type TypeSample } from './samples';
import { VIEWS } from './views';

// Every type in sidebar order; types sharing a sample (`also`) follow it
const TYPE_LIST = SAMPLES.flatMap((s) =>
  [s.type, ...(s.also ?? [])].map((type) => ({
    type,
    section: s.section,
    search: [type, ...s.tags].join(' ').toLowerCase(),
  })),
);

const KEYWORDS =
  /\b(ONE|TWO|THREE|NO MORE THAN|AND\/OR A NUMBER|ONLY|TRUE|FALSE|NOT GIVEN|YES|NO)\b/;

const Instruction = ({ text }: { text: string }) => (
  <span className="text-foreground/80 basis-full text-sm leading-relaxed whitespace-pre-line">
    {text.split(KEYWORDS).map((part, i) =>
      i % 2 ? (
        <b key={i} className="text-accent font-semibold">
          {part}
        </b>
      ) : (
        part
      ),
    )}
  </span>
);

const groupRange = (sample: TypeSample) => {
  const first = sample.questions[0].n;
  const last = sample.questions.at(-1)!;
  const end = last.nTo ?? last.n;
  return first === end ? `${first}` : `${first}–${end}`;
};

const SampleCard = ({ type }: { type: QuestionType }) => {
  const { t } = useTranslation();
  const sample = useMemo(() => findSample(type), [type]);
  const [answers, setAnswers] = useState<PreviewAnswers>({});
  const [checked, setChecked] = useState(false);

  const { results, score, total } = useMemo(
    () => gradeSample(sample, answers),
    [sample, answers],
  );
  const isOpenEnded = sample.view === 'speak' || sample.view === 'write';
  const View = VIEWS[sample.view];

  const setAnswer = (n: number, value: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [n]: value }));

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  const body = (
    <div className="min-w-0 p-4">
      <View />
    </div>
  );

  return (
    <PreviewContext.Provider
      value={{ sample, answers, setAnswer, checked, results }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">
              {t(`tests.questionType.${type}`)}
            </h3>
            <span className="bg-default text-foreground/70 rounded-md px-1.5 py-0.5 font-mono text-xs">
              {type}
            </span>
            {sample.also && (
              <span className="border-border text-foreground/70 rounded-md border border-dashed px-1.5 py-0.5 text-xs">
                {t('tests.editor.typePreview.also', {
                  types: [sample.type, ...sample.also]
                    .filter((x) => x !== type)
                    .join(', '),
                })}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sample.tags.map((tag) => (
              <span
                key={tag}
                className="bg-accent-soft text-accent-soft-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="bg-accent-soft/40 border-accent flex gap-2.5 rounded-lg border-l-4 p-3">
            <LuInfo className="text-accent mt-0.5 size-4 shrink-0" />
            <div className="text-sm leading-relaxed">
              <div className="mb-0.5 font-semibold">
                {t('tests.editor.typePreview.howItWorks')}
              </div>
              <p className="text-foreground/90">{sample.desc}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="text-foreground/60 text-xs font-semibold tracking-wider uppercase">
            {t('tests.editor.typePreview.livePreview')}
          </div>
          <div className="border-border bg-surface overflow-hidden rounded-xl border">
            <div className="border-border bg-default/50 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-4 py-3">
              <span className="bg-accent text-accent-foreground rounded-md px-2 py-0.5 text-sm font-bold">
                {t('tests.editor.typePreview.questions', {
                  range: groupRange(sample),
                })}
              </span>
              <Instruction text={sample.group.instruction} />
            </div>
            {sample.passage ? (
              <div className="grid md:grid-cols-2">
                <PassagePane passage={sample.passage} />
                {body}
              </div>
            ) : (
              body
            )}
            <div className="border-border flex flex-wrap items-center gap-2 border-t px-4 py-3">
              <Button
                size="sm"
                variant="primary"
                onPress={() => setChecked(true)}
              >
                {isOpenEnded
                  ? t('tests.editor.typePreview.showSample')
                  : t('tests.editor.typePreview.check')}
              </Button>
              <Button size="sm" variant="ghost" onPress={reset}>
                {t('tests.editor.typePreview.reset')}
              </Button>
              {checked && !isOpenEnded && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-2.5 py-0.5 text-sm font-semibold',
                    score === total
                      ? 'bg-success/15 text-success'
                      : 'bg-warning/15 text-warning',
                  )}
                >
                  {t('tests.editor.typePreview.score', { score, total })}
                </span>
              )}
            </div>
          </div>
        </div>

        <details className="border-border rounded-lg border">
          <summary className="text-muted flex cursor-pointer items-center gap-1.5 px-3 py-2 text-xs">
            <LuCode className="size-3.5" />
            {t('tests.editor.typePreview.storedJson')}
          </summary>
          <pre className="bg-default/40 max-h-80 overflow-auto px-3 py-2 font-mono text-xs">
            {JSON.stringify(storedShape(sample), null, 2)}
          </pre>
        </details>
      </div>
    </PreviewContext.Provider>
  );
};

const TypeNav = ({
  selected,
  onSelect,
}: {
  selected: QuestionType;
  onSelect: (type: QuestionType) => void;
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const items = TYPE_LIST.filter(
    (item) =>
      !query ||
      item.search.includes(query) ||
      t(`tests.questionType.${item.type}`).toLowerCase().includes(query),
  );

  return (
    <nav className="flex min-h-0 flex-col gap-2">
      <TextInput
        placeholder={t('tests.editor.typePreview.search')}
        value={search}
        onChange={setSearch}
      />
      <div className="flex max-h-48 flex-col overflow-y-auto md:max-h-none">
        {items.map((item, i) => (
          <div key={item.type}>
            {item.section !== items[i - 1]?.section && (
              <div
                className={cn(
                  'text-foreground/60 mb-1 px-2 text-[11px] font-semibold tracking-wider uppercase',
                  i > 0 && 'border-border mt-2 border-t pt-2',
                )}
              >
                {item.section}
              </div>
            )}
            <button
              type="button"
              onClick={() => onSelect(item.type)}
              className={cn(
                'text-foreground w-full truncate rounded-md border-l-2 px-2 py-1 text-left text-sm',
                item.type === selected
                  ? 'bg-accent-soft text-accent-soft-foreground border-accent font-medium'
                  : 'hover:bg-default border-transparent',
              )}
            >
              {t(`tests.questionType.${item.type}`)}
            </button>
          </div>
        ))}
        {!items.length && (
          <p className="text-muted px-2 text-sm">
            {t('tests.editor.typePreview.noMatch')}
          </p>
        )}
      </div>
    </nav>
  );
};

type QuestionTypePreviewModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialType?: QuestionType;
};

// Content unmounts on close, so each open starts at `initialType`
const PreviewBody = ({
  initialType = SAMPLES[0].type,
}: {
  initialType?: QuestionType;
}) => {
  const [type, setType] = useState(initialType);
  return (
    <Modal.Body className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="md:sticky md:top-0 md:max-h-[70vh] md:overflow-y-auto">
        <TypeNav selected={type} onSelect={setType} />
      </div>
      <SampleCard key={type} type={type} />
    </Modal.Body>
  );
};

const QuestionTypePreviewModal = ({
  isOpen,
  onOpenChange,
  initialType,
}: QuestionTypePreviewModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container scroll="inside">
        <Modal.Dialog className="sm:max-w-6xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{t('tests.editor.typePreview.title')}</Modal.Heading>
          </Modal.Header>
          <PreviewBody initialType={initialType} />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default QuestionTypePreviewModal;
