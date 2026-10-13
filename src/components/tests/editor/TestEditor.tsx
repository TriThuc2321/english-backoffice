import { Skeleton } from '@heroui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

import type { QuestionType } from '@/types/test';

import { useGetTestParts } from '@/hooks/apis/test-parts';
import { useGetTestSections } from '@/hooks/apis/test-sections';
import { useGetTestById } from '@/hooks/apis/tests';

import EditorHeader from './EditorHeader';
import EditorTree from './EditorTree';
import GroupPanel from './group/GroupPanel';
import PartPanel from './PartPanel';
import SectionPanel from './SectionPanel';
import TestOverviewPanel from './TestOverviewPanel';
import { byOrder } from './utils';

// Editor selection lives in the URL: ?section=&part=&group=(id|new)&type=
export type EditorLocation = {
  section?: number;
  part?: number;
  group?: string;
  type?: QuestionType;
};

const LOCATION_KEYS = ['section', 'part', 'group', 'type'] as const;

const EditorSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-10 w-1/2 rounded-lg" />
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  </div>
);

const NotFound = ({ label }: { label: string }) => (
  <div className="text-muted rounded-xl border py-8 text-center text-sm">
    {label}
  </div>
);

type TestEditorProps = {
  id: number;
};

const TestEditor = ({ id }: TestEditorProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: test, isLoading } = useGetTestById(id);
  const { data: sectionsData, isLoading: isLoadingSections } =
    useGetTestSections(id);

  const sections = useMemo(() => byOrder(sectionsData ?? []), [sectionsData]);

  const selectedId = Number(searchParams.get('section')) || undefined;
  const selected = sections.find((section) => section.id === selectedId);
  const partId = Number(searchParams.get('part')) || undefined;
  const groupParam = searchParams.get('group');
  const groupId =
    groupParam === 'new' ? 'new' : Number(groupParam) || undefined;
  const newType = (searchParams.get('type') ?? undefined) as
    | QuestionType
    | undefined;

  const { data: partsData, isLoading: isLoadingParts } = useGetTestParts(
    selected && partId ? selected.id : undefined,
  );
  const parts = useMemo(() => byOrder(partsData ?? []), [partsData]);
  const partIndex = parts.findIndex((part) => part.id === partId);
  const part = parts[partIndex];

  const onNavigate = (location: EditorLocation) =>
    setSearchParams((prev) => {
      LOCATION_KEYS.forEach((key) => {
        const value = location[key];
        if (value != null) prev.set(key, String(value));
        else prev.delete(key);
      });
      return prev;
    });

  const onSelect = (sectionId?: number) => onNavigate({ section: sectionId });

  if (isLoading || isLoadingSections) return <EditorSkeleton />;
  if (!test) return null;

  const renderPanel = () => {
    if (!selectedId)
      return (
        <TestOverviewPanel test={test} sections={sections} onOpen={onSelect} />
      );
    if (!selected)
      return <NotFound label={t('tests.editor.sectionNotFound')} />;
    if (!partId)
      return (
        <SectionPanel
          key={selected.id}
          test={test}
          section={selected}
          sections={sections}
          onDeleted={() => onSelect(undefined)}
          onOpenPart={(id) => onNavigate({ section: selected.id, part: id })}
        />
      );
    if (isLoadingParts) return <Skeleton className="h-96 rounded-xl" />;
    if (!part) return <NotFound label={t('tests.editor.partNotFound')} />;

    const partName =
      part.title || t('tests.editor.partFallback', { n: partIndex + 1 });
    if (!groupId)
      return (
        <PartPanel
          key={part.id}
          test={test}
          section={selected}
          part={part}
          partName={partName}
          onNavigate={onNavigate}
        />
      );
    return (
      <GroupPanel
        key={`${part.id}-${groupId}-${newType ?? ''}`}
        test={test}
        section={selected}
        part={part}
        groupId={groupId}
        newType={newType}
        onNavigate={onNavigate}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <EditorHeader test={test} />
      <div className="grid items-start gap-4 md:grid-cols-[280px_1fr]">
        <EditorTree
          test={test}
          sections={sections}
          location={{
            section: selectedId,
            part: partId,
            group: groupParam ?? undefined,
          }}
          onNavigate={onNavigate}
        />
        <div className="min-w-0">{renderPanel()}</div>
      </div>
    </div>
  );
};

export default TestEditor;
