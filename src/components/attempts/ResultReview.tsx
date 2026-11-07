import { Button, Card, Disclosure, Tabs } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft, LuChevronRight, LuFlag } from 'react-icons/lu';

import type {
  AnswerPart,
  Breakdown,
  NumberStatus,
  ReviewItem,
  SectionResult,
} from '@/utils/attemptResult';

import AssessmentPanel from './AssessmentPanel';

const CELL_CLASSES: Record<NumberStatus, string> = {
  correct: 'bg-success text-success-foreground border border-success',
  incorrect: 'bg-danger-soft text-foreground border-2 border-danger',
  blank: 'text-muted border border-dashed',
  pending: 'bg-surface-secondary text-muted border',
  graded: 'bg-accent-soft text-accent-soft-foreground border border-accent',
};

const BADGE_CLASSES: Record<NumberStatus, string> = {
  correct: 'bg-success text-success-foreground',
  incorrect: 'bg-danger text-danger-foreground',
  blank: 'bg-surface-secondary text-muted',
  pending: 'bg-surface-secondary text-muted',
  graded: 'bg-accent-soft text-accent-soft-foreground',
};

const SWATCHES: Record<NumberStatus, string> = {
  correct: 'bg-success',
  incorrect: 'border-2 border-danger bg-danger-soft',
  blank: 'border border-dashed',
  pending: 'border bg-surface-secondary',
  graded: 'border border-accent bg-accent-soft',
};

const GLYPHS: Record<NumberStatus, string> = {
  correct: '✓',
  incorrect: '✗',
  blank: '–',
  pending: '…',
  graded: '✓',
};

const formatPart = ({ key, text }: AnswerPart) =>
  key && text ? `${key} · ${text}` : (key ?? text ?? '');

const ResultReview = ({
  sections,
  onAudioError,
}: {
  sections: SectionResult[];
  onAudioError: () => void;
}) => {
  const { t } = useTranslation();
  const [sectionId, setSectionId] = useState(sections[0]?.sectionId);
  const [selected, setSelected] = useState<Record<number, string>>({});

  const section =
    sections.find((s) => s.sectionId === sectionId) ?? sections[0];
  if (!section) return null;

  const items = section.items;
  const current =
    items.find((item) => item.key === selected[section.sectionId]) ?? items[0];
  const index = current ? items.indexOf(current) : -1;
  const select = (key: string) =>
    setSelected((prev) => ({ ...prev, [section.sectionId]: key }));

  const content = (
    <>
      <AssessmentPanel section={section} />
      <AnswerGrid
        section={section}
        selectedKey={current?.key ?? null}
        onSelect={select}
      />
      <FocusBreakdown section={section} />
      {section.transcripts.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>{t('attempts.result.transcripts')}</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            {section.transcripts.map((tr, i) => (
              <Disclosure key={tr.mediaId}>
                <Disclosure.Heading>
                  <Button
                    slot="trigger"
                    variant="secondary"
                    className="w-full justify-between"
                  >
                    {tr.partTitle ??
                      t('attempts.result.transcriptN', { n: i + 1 })}
                    <Disclosure.Indicator />
                  </Button>
                </Disclosure.Heading>
                <Disclosure.Content>
                  <Disclosure.Body className="pt-3 text-sm leading-6 whitespace-pre-line">
                    {tr.transcript}
                  </Disclosure.Body>
                </Disclosure.Content>
              </Disclosure>
            ))}
          </Card.Content>
        </Card>
      )}
    </>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
      <div className="flex min-w-0 flex-col gap-6">
        {sections.length > 1 ? (
          <Tabs
            selectedKey={String(section.sectionId)}
            onSelectionChange={(key) => setSectionId(Number(key))}
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label={t('attempts.result.sections')}>
                {sections.map((s) => (
                  <Tabs.Tab key={s.sectionId} id={String(s.sectionId)}>
                    {t(`tests.skill.${s.skill}`)}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
            {sections.map((s) => (
              <Tabs.Panel
                key={s.sectionId}
                id={String(s.sectionId)}
                className="flex flex-col gap-6 px-0 pt-6 pb-0"
              >
                {content}
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
          content
        )}
      </div>
      {current && (
        <ReviewPanel
          item={current}
          onAudioError={onAudioError}
          onPrev={index > 0 ? () => select(items[index - 1].key) : null}
          onNext={
            index < items.length - 1 ? () => select(items[index + 1].key) : null
          }
        />
      )}
    </div>
  );
};

const AnswerGrid = ({
  section,
  selectedKey,
  onSelect,
}: {
  section: SectionResult;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) => {
  const { t } = useTranslation();
  const legend = (Object.keys(section.counts) as NumberStatus[]).filter(
    (status) =>
      (status !== 'pending' && status !== 'graded') ||
      section.counts[status] > 0,
  );

  return (
    <Card>
      <Card.Header className="flex flex-row flex-wrap items-center justify-between gap-3">
        <Card.Title>
          {t('attempts.result.answersTitle', {
            section: t(`tests.skill.${section.skill}`),
          })}
        </Card.Title>
        <ul className="text-muted flex flex-wrap gap-3 text-xs">
          {legend.map((status) => (
            <li key={status} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={`size-3.5 rounded ${SWATCHES[status]}`}
              />
              {t(`attempts.result.legend.${status}`, {
                count: section.counts[status],
              })}
            </li>
          ))}
        </ul>
      </Card.Header>
      <Card.Content>
        {section.items.length === 0 ? (
          <p className="text-muted text-sm">
            {t('attempts.result.emptySection')}
          </p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-1.5">
            {section.items.map((item) => {
              const on = item.key === selectedKey;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={t('attempts.result.questionAria', {
                      n: item.n,
                      status: t(`attempts.result.status.${item.status}`),
                    })}
                    onClick={() => onSelect(item.key)}
                    className={`relative flex h-11 w-full cursor-pointer flex-col items-center justify-center gap-px rounded-lg text-sm font-semibold tabular-nums ${CELL_CLASSES[item.status]} ${on ? 'ring-foreground ring-2 ring-offset-2' : ''}`}
                  >
                    {item.n}
                    <span aria-hidden className="text-[11px] leading-none">
                      {GLYPHS[item.status]}
                    </span>
                    {item.flagged && (
                      <LuFlag
                        aria-hidden
                        className="text-warning absolute top-0.5 right-0.5 size-2.5"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card.Content>
    </Card>
  );
};

const FocusBreakdown = ({ section }: { section: SectionResult }) => {
  const { t } = useTranslation();

  if (section.byPart.length === 0 && section.byType.length === 0) return null;

  const label = (b: Breakdown) =>
    typeof b.label === 'string'
      ? t(`tests.questionType.${b.label}`)
      : (b.label.partTitle ??
        t('attempts.result.partFallback', { order: b.label.partOrder }));

  const column = (heading: string, rows: Breakdown[], showWeak: boolean) => (
    <div className="flex flex-col gap-3">
      <h3 className="text-muted text-sm font-semibold">{heading}</h3>
      {rows.map((b) => (
        <div key={b.id} className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-2 text-sm">
            <span>
              {label(b)}
              {showWeak && b.weak && (
                <span className="bg-warning-soft text-warning ml-2 rounded px-1.5 py-px text-[11px] font-semibold whitespace-nowrap">
                  {t('attempts.result.needsWork')}
                </span>
              )}
            </span>
            <span className="whitespace-nowrap tabular-nums">
              <b>{b.pct}%</b>{' '}
              <span className="text-muted">
                {b.correct}/{b.total}
              </span>
            </span>
          </div>
          <div
            aria-hidden
            className="bg-surface-secondary h-2 overflow-hidden rounded-full"
          >
            <div
              className="bg-accent h-full rounded-full"
              style={{ width: `${b.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('attempts.result.breakdownTitle')}</Card.Title>
      </Card.Header>
      <Card.Content className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-8 gap-y-6">
        {column(t('attempts.result.byPart'), section.byPart, false)}
        {column(t('attempts.result.byType'), section.byType, true)}
      </Card.Content>
    </Card>
  );
};

const ReviewPanel = ({
  item,
  onPrev,
  onNext,
  onAudioError,
}: {
  item: ReviewItem;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
  onAudioError: () => void;
}) => {
  const { t } = useTranslation();
  const isEssay = item.sample !== null;

  return (
    <Card className="lg:sticky lg:top-4">
      <Card.Header className="flex flex-row items-start justify-between gap-2">
        <div>
          {item.questionType && (
            <p className="text-accent text-xs font-semibold tracking-[0.08em] uppercase">
              {t(`tests.questionType.${item.questionType}`)}
            </p>
          )}
          <Card.Title className="mt-0.5">
            {item.from === item.to
              ? t('attempts.result.questionN', { n: item.n })
              : t('attempts.result.questionsRange', {
                  from: item.from,
                  to: item.to,
                })}
          </Card.Title>
        </div>
        <span
          className={`flex-none rounded px-2.5 py-1 text-xs font-semibold ${BADGE_CLASSES[item.status]}`}
        >
          {GLYPHS[item.status]} {t(`attempts.result.status.${item.status}`)}
        </span>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        {item.flagged && (
          <p className="text-warning flex items-center gap-1.5 text-xs">
            <LuFlag aria-hidden className="size-3.5" />
            {t('attempts.result.flagged')}
          </p>
        )}
        <p className={item.prompt ? 'text-sm' : 'text-muted text-sm'}>
          {item.prompt ?? t('attempts.result.promptFallback')}
        </p>
        <div className="bg-surface-secondary rounded-lg px-3.5 py-3">
          {item.audioUrl ? (
            <>
              <p className="text-muted text-xs">
                {t('attempts.result.recording')}
              </p>
              {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- a student's recording has no captions */}
              <audio
                controls
                src={item.audioUrl}
                onError={onAudioError}
                className="mt-1.5 w-full"
              />
            </>
          ) : (
            <>
              <p className="text-muted text-xs">
                {t('attempts.result.studentAnswer')}
              </p>
              <p
                className={`mt-0.5 ${isEssay ? 'max-h-96 overflow-y-auto text-sm leading-6 whitespace-pre-line' : 'font-semibold'}`}
              >
                {item.studentAnswer.length > 0
                  ? item.studentAnswer.map(formatPart).join(', ')
                  : t('attempts.result.noAnswer')}
              </p>
            </>
          )}
        </div>
        <div className="rounded-lg border border-dashed px-3.5 py-3">
          <p className="text-muted text-xs">
            {isEssay
              ? t('grading.screen.sampleAnswer')
              : t('attempts.result.correctAnswer')}
          </p>
          {isEssay ? (
            <p className="mt-0.5 max-h-96 overflow-y-auto text-sm leading-6 whitespace-pre-line">
              {item.sample}
            </p>
          ) : item.correctAnswer ? (
            <>
              <p className="mt-0.5 font-semibold">
                {item.correctAnswer.map(formatPart).join(', ')}
              </p>
              {item.alsoAccepted.length > 0 && (
                <p className="text-muted mt-0.5 text-sm">
                  {t('attempts.result.alsoAccepted', {
                    list: item.alsoAccepted.join(', '),
                  })}
                </p>
              )}
            </>
          ) : (
            <p className="text-muted mt-0.5 text-sm">
              {t('attempts.result.gradedByTeacher')}
            </p>
          )}
        </div>
        {(item.explanation || item.evidence) && (
          <div className="rounded-lg border border-dashed px-3.5 py-3">
            <p className="text-muted text-xs">
              {t('attempts.result.explanation')}
            </p>
            {item.explanation && (
              <p className="mt-0.5 text-sm">{item.explanation}</p>
            )}
            {item.evidence && (
              <blockquote className="border-accent mt-3 border-l-2 pl-3 text-sm">
                <p className="text-muted text-xs">
                  {t('attempts.result.evidence')}
                  {item.evidence.paragraph &&
                    ` · ${t('attempts.result.paragraph', { label: item.evidence.paragraph })}`}
                </p>
                {item.evidence.quote && (
                  <p className="mt-0.5 italic">“{item.evidence.quote}”</p>
                )}
              </blockquote>
            )}
          </div>
        )}
        <div className="flex justify-between gap-2">
          <Button
            variant="secondary"
            isDisabled={!onPrev}
            onPress={() => onPrev?.()}
          >
            <LuChevronLeft aria-hidden className="size-4" />
            {t('attempts.result.previous')}
          </Button>
          <Button
            variant="secondary"
            isDisabled={!onNext}
            onPress={() => onNext?.()}
          >
            {t('attempts.result.next')}
            <LuChevronRight aria-hidden className="size-4" />
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ResultReview;
