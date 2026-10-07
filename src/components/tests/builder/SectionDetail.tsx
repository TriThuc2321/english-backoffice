import { useTranslation } from 'react-i18next';
import { LuLayers, LuPlus } from 'react-icons/lu';

import type { QuestionGroup, TestSection } from '@/types/test';

import MyButton from '@/components/shared/Button';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { PermissionAction, SubjectName } from '@/types/auth';

import type { Numbering } from './utils';

import GroupRow from './GroupRow';
import PassagePicker from './PassagePicker';
import { sortGroups } from './utils';

type SectionDetailProps = {
  section: TestSection | null;
  order: number;
  groups: QuestionGroup[];
  numbering: Numbering;
  editingGroupId: string | null;
  onEditGroup: (groupId: string) => void;
  onAddGroup: () => void;
  onAddSection: () => void;
  isAddingSection: boolean;
  onDeleteSection: (sectionId: string) => void;
  isDeletingSection: boolean;
  onDeleteGroup: (groupId: string) => void;
  deletingGroupId: string | null;
};

const Divider = ({ label, right }: { label: string; right?: string }) => (
  <div className="flex items-center gap-3 pt-2">
    <span className="text-default-400 font-mono text-xs tracking-wide uppercase">
      {label}
    </span>
    <div className="bg-default-200 h-px flex-1" />
    {right && <span className="text-default-400 text-xs">{right}</span>}
  </div>
);

const SectionDetail = ({
  section,
  order,
  groups,
  numbering,
  editingGroupId,
  onEditGroup,
  onAddGroup,
  onAddSection,
  isAddingSection,
  onDeleteSection,
  isDeletingSection,
  onDeleteGroup,
  deletingGroupId,
}: SectionDetailProps) => {
  const { t } = useTranslation();

  if (!section) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="bg-default-100 text-default-400 flex size-14 items-center justify-center rounded-2xl">
          <LuLayers className="size-6" />
        </div>
        <p className="text-default-900 font-semibold">
          {t('tests.builder.detail.noSection')}
        </p>
        <p className="text-default-500 max-w-sm text-sm">
          {t('tests.builder.detail.noSectionHint')}
        </p>
        <MyButton
          I={PermissionAction.Create}
          a={SubjectName.Tests}
          variant="primary"
          size="sm"
          isPending={isAddingSection}
          onPress={onAddSection}
        >
          <LuPlus className="size-3.5" />
          {t('tests.builder.detail.addFirstSection')}
        </MyButton>
      </div>
    );
  }

  const sortedGroups = sortGroups(groups);
  const sectionQuestionCount = numbering.countBySectionId[section.id] ?? 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-default-900 text-lg font-semibold">
            {t('tests.builder.detail.sectionTitle', { order })}
          </h2>
          <ConfirmWrapper
            placement="bottom-end"
            title={t('tests.builder.rail.deleteTitle')}
            description={t('tests.builder.rail.deleteConfirm', { order })}
            onConfirm={() => onDeleteSection(section.id)}
          >
            <MyButton
              I={PermissionAction.Delete}
              a={SubjectName.Tests}
              size="sm"
              variant="danger-soft"
              isPending={isDeletingSection}
            >
              {t('tests.builder.detail.remove')}
            </MyButton>
          </ConfirmWrapper>
        </div>

        <Divider label={t('tests.builder.detail.passage.label')} />
        <PassagePicker section={section} />

        <Divider
          label={t('tests.builder.detail.groups.label')}
          right={t('tests.builder.detail.groups.count', {
            count: sectionQuestionCount,
          })}
        />

        {sortedGroups.length === 0 ? (
          <MyButton
            I={PermissionAction.Create}
            a={SubjectName.Tests}
            variant="ghost"
            onPress={onAddGroup}
            className="border-default-300 text-default-500 h-auto justify-center rounded-xl border border-dashed py-8"
          >
            <LuPlus className="size-4" />
            {t('tests.builder.detail.groups.addFirst')}
          </MyButton>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedGroups.map((group, index) => (
              <GroupRow
                key={group.id}
                group={group}
                index={index}
                startNumber={numbering.startByGroupId[group.id] ?? 1}
                isEditing={group.id === editingGroupId}
                onEdit={() => onEditGroup(group.id)}
                onDelete={() => onDeleteGroup(group.id)}
                isDeleting={deletingGroupId === group.id}
              />
            ))}

            <MyButton
              I={PermissionAction.Create}
              a={SubjectName.Tests}
              size="sm"
              variant="ghost"
              onPress={onAddGroup}
              className="border-default-300 text-default-500 justify-center rounded-xl border border-dashed"
            >
              <LuPlus className="size-3.5" />
              {t('tests.builder.detail.groups.add')}
            </MyButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionDetail;
