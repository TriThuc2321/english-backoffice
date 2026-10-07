import { Chip } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import type { TestSection } from '@/types/test';

import MyButton from '@/components/shared/Button';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteQuestionGroup } from '@/hooks/apis/questionGroups';
import { useDeleteTestSection } from '@/hooks/apis/testSections';
import { PermissionAction, SubjectName } from '@/types/auth';

import AddQuestionGroupForm from './AddQuestionGroupForm';
import QuestionGroupItem from './QuestionGroupItem';

type SectionCardProps = {
  section: TestSection;
};

const SectionCard = ({ section }: SectionCardProps) => {
  const { t } = useTranslation();
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const { mutate: deleteSection, isPending: isDeletingSection } =
    useDeleteTestSection();
  const { mutate: deleteGroup } = useDeleteQuestionGroup();

  const handleDeleteSection = () => {
    deleteSection([section.id]);
  };

  const handleDeleteGroup = (groupId: string) => {
    setDeletingGroupId(groupId);
    deleteGroup([groupId], { onSettled: () => setDeletingGroupId(null) });
  };

  return (
    <div className="rounded-xl border">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <span className="text-default-900 font-semibold">
          {t('tests.sections.title')} {section.order ?? ''}
        </span>

        {section.passage?.title ? (
          <Chip size="sm" variant="soft" color="accent">
            <Chip.Label className="max-w-[200px] truncate">
              {section.passage.title}
            </Chip.Label>
          </Chip>
        ) : (
          <Chip size="sm" variant="soft" color="default">
            <Chip.Label>{t('tests.sections.noPassage')}</Chip.Label>
          </Chip>
        )}

        <div className="ml-auto">
          <ConfirmWrapper
            placement="bottom-end"
            title={t('tests.sections.deleteTitle')}
            description={t('tests.sections.deleteConfirm', {
              order: section.order ?? '',
            })}
            onConfirm={handleDeleteSection}
          >
            <MyButton
              I={PermissionAction.Delete}
              a={SubjectName.Tests}
              isIconOnly
              size="sm"
              variant="danger-soft"
              isPending={isDeletingSection}
            >
              <LuTrash2 className="size-3.5" />
            </MyButton>
          </ConfirmWrapper>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {section.questionGroups && section.questionGroups.length > 0
          ? section.questionGroups.map((group) => (
              <QuestionGroupItem
                key={group.id}
                group={group}
                onDelete={() => handleDeleteGroup(group.id)}
                isDeleting={deletingGroupId === group.id}
              />
            ))
          : !showAddGroupForm && (
              <p className="text-default-400 py-2 text-center text-sm">
                {t('tests.sections.questionGroups.noGroups')}
              </p>
            )}

        {showAddGroupForm && (
          <AddQuestionGroupForm
            testSectionId={section.id}
            onSuccess={() => setShowAddGroupForm(false)}
            onCancel={() => setShowAddGroupForm(false)}
          />
        )}

        {!showAddGroupForm && (
          <MyButton
            I={PermissionAction.Create}
            a={SubjectName.Tests}
            size="sm"
            variant="tertiary"
            className="mt-1 self-start"
            onPress={() => setShowAddGroupForm(true)}
          >
            <LuPlus className="size-3.5" />
            {t('tests.sections.questionGroups.addGroup')}
          </MyButton>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
