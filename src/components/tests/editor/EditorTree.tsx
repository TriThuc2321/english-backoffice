import { Card, cn, Tooltip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronRight, LuFileText } from 'react-icons/lu';

import type { Test, TestSection } from '@/types/test';

import {
  useGetQuestionGroups,
  useGetQuestionGroupsDetail,
} from '@/hooks/apis/question-groups';
import { useGetTestParts } from '@/hooks/apis/test-parts';

import type { EditorLocation } from './TestEditor';

import AddSectionMenu from './AddSectionMenu';
import { groupRange } from './groupForm';
import { byOrder } from './utils';

type TreeNodeProps = {
  isSelected?: boolean;
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
};

const TreeNode = ({
  isSelected,
  onPress,
  className,
  children,
}: TreeNodeProps) => (
  <button
    type="button"
    onClick={onPress}
    disabled={!onPress}
    className={cn(
      'rounded-field flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-sm',
      onPress && 'hover:bg-default cursor-pointer',
      isSelected && 'bg-accent-soft text-accent font-semibold',
      className,
    )}
  >
    {children}
  </button>
);

const PartGroups = ({
  sectionId,
  partId,
  selectedGroup,
  onNavigate,
}: {
  sectionId: number;
  partId: number;
  selectedGroup?: string;
  onNavigate: (location: EditorLocation) => void;
}) => {
  const { t } = useTranslation();
  const { data } = useGetQuestionGroups(partId);
  const groups = byOrder(data ?? []);
  const details = useGetQuestionGroupsDetail(groups.map((g) => g.id));

  return groups.map((group, index) => {
    const range = groupRange(details[index]?.data?.questions);
    const label = t(`tests.questionType.${group.questionType}`);
    return (
      <Tooltip delay={0} key={group.id}>
        <Tooltip.Trigger className="flex w-full">
          <TreeNode
            className="pl-12"
            isSelected={selectedGroup === String(group.id)}
            onPress={() =>
              onNavigate({
                section: sectionId,
                part: partId,
                group: String(group.id),
              })
            }
          >
            {range && (
              <span className="text-muted shrink-0 text-xs">
                {t('tests.editor.group.questionRange', range)}
              </span>
            )}
            <span className="truncate">{label}</span>
          </TreeNode>
        </Tooltip.Trigger>
        <Tooltip.Content placement="right">{label}</Tooltip.Content>
      </Tooltip>
    );
  });
};

const SectionParts = ({
  sectionId,
  location,
  onNavigate,
}: {
  sectionId: number;
  location: EditorLocation;
  onNavigate: (location: EditorLocation) => void;
}) => {
  const { t } = useTranslation();
  const { data: parts = [] } = useGetTestParts(sectionId);

  return byOrder(parts).map((part, index) => {
    const isOpen = part.id === location.part;
    const Caret = isOpen ? LuChevronDown : LuChevronRight;
    return (
      <div key={part.id} className="flex flex-col gap-0.5">
        <TreeNode
          className="pl-6"
          isSelected={isOpen && !location.group}
          onPress={() => onNavigate({ section: sectionId, part: part.id })}
        >
          <Caret className="size-4 shrink-0" />
          <span className="truncate">
            {part.title || t('tests.editor.partFallback', { n: index + 1 })}
          </span>
        </TreeNode>
        {isOpen && (
          <PartGroups
            sectionId={sectionId}
            partId={part.id}
            selectedGroup={location.group}
            onNavigate={onNavigate}
          />
        )}
      </div>
    );
  });
};

type EditorTreeProps = {
  test: Test;
  sections: TestSection[];
  location: EditorLocation;
  onNavigate: (location: EditorLocation) => void;
};

const EditorTree = ({
  test,
  sections,
  location,
  onNavigate,
}: EditorTreeProps) => {
  const { t } = useTranslation();

  return (
    <Card className="md:sticky md:top-0 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto">
      <Card.Content className="flex flex-col gap-0.5 p-2">
        <TreeNode isSelected={!location.section} onPress={() => onNavigate({})}>
          <LuFileText className="size-4 shrink-0" />
          <span className="truncate">{t('tests.editor.overview')}</span>
        </TreeNode>

        {sections.map((section) => {
          const isOpen = section.id === location.section;
          const Caret = isOpen ? LuChevronDown : LuChevronRight;
          return (
            <div key={section.id} className="flex flex-col gap-0.5">
              <TreeNode
                isSelected={isOpen && !location.part}
                onPress={() => onNavigate({ section: section.id })}
              >
                <Caret className="size-4 shrink-0" />
                <span className="truncate">
                  {t(`tests.skill.${section.skill}`)}
                  {section.durationMinutes != null &&
                    ` · ${t('tests.minutesShort', { count: section.durationMinutes })}`}
                </span>
              </TreeNode>
              {isOpen && (
                <SectionParts
                  sectionId={section.id}
                  location={location}
                  onNavigate={onNavigate}
                />
              )}
            </div>
          );
        })}

        <div className="mt-2">
          <AddSectionMenu
            test={test}
            sections={sections}
            onCreated={(id) => onNavigate({ section: id })}
          />
        </div>
      </Card.Content>
    </Card>
  );
};

export default EditorTree;
