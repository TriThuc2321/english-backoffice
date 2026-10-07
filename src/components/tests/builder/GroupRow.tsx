import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';

import type { QuestionGroup } from '@/types/test';

import MyButton from '@/components/shared/Button';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { PermissionAction, SubjectName } from '@/types/auth';

import { getGroupQuestionCount } from './utils';

type GroupRowProps = {
  group: QuestionGroup;
  index: number;
  startNumber: number;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

const GroupRow = ({
  group,
  index,
  startNumber,
  isEditing,
  onEdit,
  onDelete,
  isDeleting,
}: GroupRowProps) => {
  const { t } = useTranslation();
  const count = getGroupQuestionCount(group);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      }}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
        isEditing
          ? 'border-accent bg-accent/10'
          : 'bg-default-50 hover:bg-default-100 border-transparent'
      }`}
    >
      <div className="bg-default-200 text-default-700 flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold">
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-default-900 truncate text-sm font-medium">
          {t(`tests.builder.types.${group.questionType}`)}
        </p>
        <p className="text-default-500 text-xs">
          {count > 0
            ? `${t('tests.builder.detail.groups.range', {
                from: startNumber,
                to: startNumber + count - 1,
              })} · `
            : ''}
          {t('tests.builder.detail.groups.items', { count })}
        </p>
      </div>

      <Button size="sm" variant="ghost" onPress={onEdit} className="shrink-0">
        {t('tests.builder.detail.groups.edit')}
      </Button>

      <div
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ConfirmWrapper
          placement="bottom-end"
          title={t('tests.builder.detail.groups.deleteTitle')}
          description={t('tests.builder.detail.groups.deleteConfirm')}
          onConfirm={onDelete}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Tests}
            isIconOnly
            size="sm"
            variant="ghost"
            isPending={isDeleting}
            aria-label={t('tests.builder.detail.groups.deleteTitle')}
          >
            <LuX className="size-3.5" />
          </MyButton>
        </ConfirmWrapper>
      </div>
    </div>
  );
};

export default GroupRow;
