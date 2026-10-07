import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuTrash2 } from 'react-icons/lu';

import type { QuestionGroup } from '@/types/test';

import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { PermissionAction, SubjectName } from '@/types/auth';

import MyButton from '../../shared/Button';

type QuestionGroupItemProps = {
  group: QuestionGroup;
  onDelete: () => void;
  isDeleting: boolean;
};

const QuestionGroupItem = ({
  group,
  onDelete,
  isDeleting,
}: QuestionGroupItemProps) => {
  const { t } = useTranslation();

  const questionCount = Array.isArray(group.questions)
    ? group.questions.length
    : 0;

  return (
    <div className="bg-default-50 flex items-center gap-3 rounded-lg border px-4 py-3">
      <Chip size="sm" variant="soft" color="default">
        <Chip.Label className="font-mono text-xs">
          {group.questionType.replace(/_/g, ' ')}
        </Chip.Label>
      </Chip>
      <p className="text-default-700 min-w-0 flex-1 truncate text-sm">
        {group.guideline}
      </p>
      {questionCount > 0 && (
        <Chip size="sm" variant="soft" color="accent">
          <Chip.Label>{questionCount}Q</Chip.Label>
        </Chip>
      )}
      <ConfirmWrapper
        placement="bottom-end"
        title={t('tests.sections.questionGroups.deleteTitle')}
        description={t('tests.sections.questionGroups.deleteConfirm')}
        onConfirm={onDelete}
      >
        <MyButton
          I={PermissionAction.Delete}
          a={SubjectName.Tests}
          isIconOnly
          size="sm"
          variant="danger-soft"
          isPending={isDeleting}
        >
          <LuTrash2 className="size-3.5" />
        </MyButton>
      </ConfirmWrapper>
    </div>
  );
};

export default QuestionGroupItem;
