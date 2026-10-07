import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuTrash2 } from 'react-icons/lu';

import type { QuestionGroup, TestSection } from '@/types/test';

import MyButton from '@/components/shared/Button';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { PermissionAction, SubjectName } from '@/types/auth';

type RailSectionCardProps = {
  section: TestSection;
  order: number;
  groups: QuestionGroup[];
  questionCount: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

const RailSectionCard = ({
  section,
  order,
  groups,
  questionCount,
  isActive,
  onSelect,
  onDelete,
  isDeleting,
}: RailSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex w-56 shrink-0 cursor-pointer flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors xl:w-full ${
        isActive
          ? 'border-accent bg-accent/10'
          : 'bg-default-50 hover:bg-default-100 border-transparent'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-default-900 text-sm font-semibold">
          {t('tests.builder.rail.section', { order })}
        </span>

        <div
          className="ml-auto"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <ConfirmWrapper
            placement="bottom-end"
            title={t('tests.builder.rail.deleteTitle')}
            description={t('tests.builder.rail.deleteConfirm', { order })}
            onConfirm={onDelete}
          >
            <MyButton
              I={PermissionAction.Delete}
              a={SubjectName.Tests}
              isIconOnly
              size="sm"
              variant="ghost"
              isPending={isDeleting}
              aria-label={t('tests.builder.rail.deleteTitle')}
            >
              <LuTrash2 className="size-3.5" />
            </MyButton>
          </ConfirmWrapper>
        </div>
      </div>

      <p className="text-default-500 truncate text-xs">
        {section.passage ? `${t('tests.builder.rail.passage')} · ` : ''}
        {t('tests.builder.rail.groups', { count: groups.length })}
        {' · '}
        {t('tests.builder.rail.questions', { count: questionCount })}
      </p>

      {groups.length === 0 && (
        <Chip size="sm" variant="soft" color="warning" className="self-start">
          <Chip.Label>{t('tests.builder.rail.noQuestions')}</Chip.Label>
        </Chip>
      )}
    </div>
  );
};

export default RailSectionCard;
