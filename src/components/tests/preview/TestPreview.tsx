import { Button, Card, Chip, Skeleton } from '@heroui/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuClock, LuEye } from 'react-icons/lu';
import { useNavigate, useSearchParams } from 'react-router';

import type { PreviewAnswers } from '@/components/tests/editor/typePreview';

import { byOrder } from '@/components/tests/editor/utils';
import { useGetTestParts } from '@/hooks/apis/test-parts';
import { useGetTestSections } from '@/hooks/apis/test-sections';
import { useGetTestById } from '@/hooks/apis/tests';

import PartPreview from './PartPreview';

const Empty = ({ label }: { label: string }) => (
  <div className="text-muted rounded-3xl border py-8 text-center text-sm">
    {label}
  </div>
);

type TestPreviewProps = {
  id?: number;
};

const TestPreview = ({ id }: TestPreviewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: test, isLoading } = useGetTestById(id);
  const { data: sectionsData, isLoading: isLoadingSections } =
    useGetTestSections(id);
  const sections = useMemo(() => byOrder(sectionsData ?? []), [sectionsData]);

  const sectionParam = Number(searchParams.get('section'));
  const section = sections.find((s) => s.id === sectionParam) ?? sections[0];

  const { data: partsData, isLoading: isLoadingParts } = useGetTestParts(
    section?.id,
  );
  const parts = useMemo(() => byOrder(partsData ?? []), [partsData]);
  const partParam = Number(searchParams.get('part'));
  const partIndex = Math.max(
    parts.findIndex((p) => p.id === partParam),
    0,
  );
  const part = parts[partIndex];

  // Keyed by group id, so answers survive switching parts
  const [answers, setAnswers] = useState<Record<number, PreviewAnswers>>({});
  const [checkedParts, setCheckedParts] = useState<Set<number>>(new Set());

  const select = (sectionId: number, partId?: number) =>
    setSearchParams(
      (prev) => {
        prev.set('section', String(sectionId));
        if (partId) prev.set('part', String(partId));
        else prev.delete('part');
        return prev;
      },
      { replace: true },
    );

  const onAnswer = (groupId: number, n: number, value: string | string[]) =>
    setAnswers((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], [n]: value },
    }));

  const setChecked = (partId: number, value: boolean) =>
    setCheckedParts((prev) => {
      const next = new Set(prev);
      if (value) next.add(partId);
      else next.delete(partId);
      return next;
    });

  if (isLoading || isLoadingSections)
    return <Skeleton className="h-96 rounded-3xl" />;
  if (!test) return <Empty label={t('tests.editor.testNotFound')} />;

  const duration = section?.durationMinutes ?? test.durationMinutes;

  const renderPart = () => {
    if (!section) return <Empty label={t('tests.editor.noSections')} />;
    if (isLoadingParts) return <Skeleton className="h-96 rounded-3xl" />;
    if (!part) return <Empty label={t('tests.editor.noParts')} />;
    return (
      <PartPreview
        key={part.id}
        part={part}
        partName={
          part.title || t('tests.editor.partFallback', { n: partIndex + 1 })
        }
        answers={answers}
        onAnswer={onAnswer}
        checked={checkedParts.has(part.id)}
        onCheck={() => setChecked(part.id, true)}
        onReset={(groupIds) => {
          setAnswers((prev) => {
            const next = { ...prev };
            groupIds.forEach((groupId) => delete next[groupId]);
            return next;
          });
          setChecked(part.id, false);
        }}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigate(`/tests/${test.id}/edit`)}
          >
            <LuArrowLeft className="size-4" />
            {t('tests.preview.back')}
          </Button>
          <h1 className="truncate text-lg font-semibold">{test.title}</h1>
          <Chip color="accent" size="sm" variant="soft">
            <Chip.Label>{t(`tests.examType.${test.examType}`)}</Chip.Label>
          </Chip>
          <Chip size="sm" variant="soft">
            <LuEye className="size-3.5" />
            <Chip.Label>{t('tests.preview.badge')}</Chip.Label>
          </Chip>
        </div>
        {duration != null && (
          <span className="text-muted flex items-center gap-1.5 text-sm tabular-nums">
            <LuClock className="size-4" />
            {t('tests.preview.duration', { count: duration })}
          </span>
        )}
      </div>

      {(sections.length > 1 || (section && parts.length > 1)) && (
        <Card>
          <Card.Content className="flex flex-col gap-2">
            {sections.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                  <Button
                    key={s.id}
                    size="sm"
                    variant={s.id === section?.id ? 'secondary' : 'ghost'}
                    onPress={() => select(s.id)}
                  >
                    {t(`tests.skill.${s.skill}`)}
                  </Button>
                ))}
              </div>
            )}
            {section && parts.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {parts.map((p, i) => (
                  <Button
                    key={p.id}
                    size="sm"
                    variant={p.id === part?.id ? 'secondary' : 'ghost'}
                    onPress={() => select(section.id, p.id)}
                  >
                    {p.title || t('tests.editor.partFallback', { n: i + 1 })}
                  </Button>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      {renderPart()}
    </div>
  );
};

export default TestPreview;
