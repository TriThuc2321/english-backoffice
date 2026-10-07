import { Drawer, Skeleton } from '@heroui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuFilePen } from 'react-icons/lu';
import { useBlocker } from 'react-router';

import type { QuestionType } from '@/types/test';

import {
  useCreateQuestionGroup,
  useDeleteQuestionGroup,
  useGetQuestionGroupsForSections,
} from '@/hooks/apis/questionGroups';
import { useGetTestById } from '@/hooks/apis/tests';
import {
  useCreateTestSection,
  useDeleteTestSection,
  useGetTestSectionsByTestId,
} from '@/hooks/apis/testSections';

import QuestionGroupEditor from './editor/QuestionGroupEditor';
import GroupTypePickerModal from './GroupTypePickerModal';
import SectionDetail from './SectionDetail';
import SectionRail from './SectionRail';
import TopBar from './TopBar';
import UnsavedGuardDialog from './UnsavedGuardDialog';
import useIsDesktop from './useIsDesktop';
import { buildNumbering, defaultQuestion, sortSections } from './utils';

type TestBuilderProps = {
  id: string;
};

const EditorPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="bg-default-100 text-default-400 flex size-12 items-center justify-center rounded-2xl">
        <LuFilePen className="size-5" />
      </div>
      <p className="text-default-900 text-sm font-semibold">
        {t('tests.builder.editor.placeholder')}
      </p>
      <p className="text-default-500 max-w-52 text-xs">
        {t('tests.builder.editor.placeholderHint')}
      </p>
    </div>
  );
};

const TestBuilder = ({ id }: TestBuilderProps) => {
  const isDesktop = useIsDesktop();

  const { data: test, isLoading: isLoadingTest } = useGetTestById(id);
  const { data: sectionsData, isLoading: isLoadingSections } =
    useGetTestSectionsByTestId(id);

  const sections = useMemo(
    () => sortSections(sectionsData ?? []),
    [sectionsData],
  );
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );
  const { groupsBySection } = useGetQuestionGroupsForSections(sectionIds);
  const numbering = useMemo(
    () => buildNumbering(sections, groupsBySection),
    [sections, groupsBySection],
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [isGroupDirty, setIsGroupDirty] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
    null,
  );
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const { mutate: createSection, isPending: isAddingSection } =
    useCreateTestSection();
  const { mutate: deleteSection } = useDeleteTestSection();
  const { mutate: createGroup } = useCreateQuestionGroup();
  const { mutate: deleteGroup } = useDeleteQuestionGroup();

  // Keep a valid selection: default to the first section, recover when the
  // selected one is deleted.
  useEffect(() => {
    if (sections.length === 0) {
      if (selectedSectionId !== null) setSelectedSectionId(null);
      return;
    }
    if (!sections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId(sections[0].id);
      setEditingGroupId(null);
    }
  }, [sections, selectedSectionId]);

  const guardThen = useCallback(
    (action: () => void) => {
      if (isGroupDirty) setPendingAction(() => action);
      else action();
    },
    [isGroupDirty],
  );

  const blocker = useBlocker(isGroupDirty);

  useEffect(() => {
    if (!isGroupDirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isGroupDirty]);

  const isGuardOpen = pendingAction !== null || blocker.state === 'blocked';

  const handleGuardLeave = () => {
    setIsGroupDirty(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    } else {
      pendingAction?.();
      setPendingAction(null);
    }
  };

  const handleGuardStay = () => {
    if (blocker.state === 'blocked') blocker.reset();
    setPendingAction(null);
  };

  const selectedSection =
    sections.find((section) => section.id === selectedSectionId) ?? null;
  const selectedOrder = selectedSection
    ? (selectedSection.order ??
      sections.findIndex((s) => s.id === selectedSection.id) + 1)
    : 0;
  const selectedGroups = selectedSectionId
    ? (groupsBySection[selectedSectionId] ?? [])
    : [];
  const editingGroup =
    selectedGroups.find((group) => group.id === editingGroupId) ?? null;

  const handleSelectSection = (sectionId: string) => {
    if (sectionId === selectedSectionId) return;
    guardThen(() => {
      setSelectedSectionId(sectionId);
      setEditingGroupId(null);
      setIsGroupDirty(false);
    });
  };

  const handleAddSection = () => {
    guardThen(() => {
      createSection(
        { testId: id, passageId: null },
        {
          onSuccess: (section) => {
            setSelectedSectionId(section.id);
            setEditingGroupId(null);
          },
        },
      );
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    guardThen(() => {
      setDeletingSectionId(sectionId);
      deleteSection([sectionId], {
        onSettled: () => setDeletingSectionId(null),
      });
    });
  };

  const handleEditGroup = (groupId: string) => {
    if (groupId === editingGroupId) return;
    guardThen(() => {
      setEditingGroupId(groupId);
      setIsGroupDirty(false);
    });
  };

  const handleAddGroup = () => {
    guardThen(() => setIsTypePickerOpen(true));
  };

  const handlePickType = (type: QuestionType) => {
    if (!selectedSectionId) return;
    const question = defaultQuestion(type);
    createGroup(
      {
        testSectionId: selectedSectionId,
        questionType: type,
        guideline: '',
        questions: [
          {
            uuid: question.uuid,
            order: 0,
            content: question.content as Record<string, any>,
          },
        ],
      },
      {
        onSuccess: (group) => {
          setIsTypePickerOpen(false);
          setEditingGroupId(group.id);
          setIsGroupDirty(false);
        },
      },
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setDeletingGroupId(groupId);
    if (groupId === editingGroupId) {
      setEditingGroupId(null);
      setIsGroupDirty(false);
    }
    deleteGroup([groupId], { onSettled: () => setDeletingGroupId(null) });
  };

  const handleCloseEditor = () => {
    guardThen(() => {
      setEditingGroupId(null);
      setIsGroupDirty(false);
    });
  };

  if (isLoadingTest || isLoadingSections) {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <Skeleton className="h-12 rounded-xl" />
        <div className="flex min-h-0 flex-1 gap-3">
          <Skeleton className="hidden w-56 rounded-xl xl:block" />
          <Skeleton className="flex-1 rounded-xl" />
          <Skeleton className="hidden w-96 rounded-xl xl:block" />
        </div>
      </div>
    );
  }

  const editor = editingGroup ? (
    <QuestionGroupEditor
      key={editingGroup.id}
      group={editingGroup}
      section={selectedSection}
      startNumber={numbering.startByGroupId[editingGroup.id] ?? 1}
      onSaved={() => setIsGroupDirty(false)}
      onCancel={handleCloseEditor}
      onDirty={setIsGroupDirty}
    />
  ) : (
    <EditorPlaceholder />
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <TopBar
        id={id}
        test={test}
        totalQuestions={numbering.total}
        sectionCount={sections.length}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_420px] xl:grid-rows-1">
        <SectionRail
          sections={sections}
          groupsBySection={groupsBySection}
          numbering={numbering}
          selectedSectionId={selectedSectionId}
          onSelect={handleSelectSection}
          onAdd={handleAddSection}
          isAdding={isAddingSection}
          onDelete={handleDeleteSection}
          deletingSectionId={deletingSectionId}
        />

        <SectionDetail
          section={selectedSection}
          order={selectedOrder}
          groups={selectedGroups}
          numbering={numbering}
          editingGroupId={editingGroupId}
          onEditGroup={handleEditGroup}
          onAddGroup={handleAddGroup}
          onAddSection={handleAddSection}
          isAddingSection={isAddingSection}
          onDeleteSection={handleDeleteSection}
          isDeletingSection={deletingSectionId === selectedSectionId}
          onDeleteGroup={handleDeleteGroup}
          deletingGroupId={deletingGroupId}
        />

        {isDesktop ? (
          <aside className="min-h-0 border-l">{editor}</aside>
        ) : (
          <Drawer>
            <Drawer.Backdrop
              isOpen={!!editingGroup}
              onOpenChange={(open) => {
                if (!open) handleCloseEditor();
              }}
            >
              <Drawer.Content placement="right" className="w-full max-w-md">
                <Drawer.Dialog className="h-full">{editor}</Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        )}
      </div>

      <GroupTypePickerModal
        isOpen={isTypePickerOpen}
        onOpenChange={setIsTypePickerOpen}
        onPick={handlePickType}
      />

      <UnsavedGuardDialog
        isOpen={isGuardOpen}
        onStay={handleGuardStay}
        onLeave={handleGuardLeave}
      />
    </div>
  );
};

export default TestBuilder;
