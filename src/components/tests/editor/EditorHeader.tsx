import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  Button,
  Chip,
} from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuLock } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Test } from '@/types/test';

import MyButton from '@/components/shared/Button';
import { useEditTest } from '@/hooks/apis/tests';
import { PermissionAction, SubjectName } from '@/types/auth';
import { TestStatus } from '@/types/test';

import { statusColorMap } from '../constants';

type EditorHeaderProps = {
  test: Test;
};

const EditorHeader = ({ test }: EditorHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: editTest, isPending } = useEditTest();

  const isPublished = test.status === TestStatus.PUBLISHED;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onPress={() => navigate('/tests')}>
            <LuArrowLeft className="size-4" />
            {t('tests.editor.back')}
          </Button>
          <h1 className="truncate text-lg font-semibold">{test.title}</h1>
          {test.lockedAt && (
            <LuLock
              className="text-muted size-4"
              aria-label={t('tests.locked')}
            />
          )}
          <Chip color="accent" size="sm" variant="soft">
            <Chip.Label>{t(`tests.examType.${test.examType}`)}</Chip.Label>
          </Chip>
          <Chip color={statusColorMap[test.status]} size="sm" variant="soft">
            <Chip.Label>{t(`tests.status.${test.status}`)}</Chip.Label>
          </Chip>
        </div>

        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Tests}
          variant={isPublished ? 'outline' : 'primary'}
          isPending={isPending}
          onPress={() =>
            editTest({
              id: test.id,
              status: isPublished ? TestStatus.DRAFT : TestStatus.PUBLISHED,
            })
          }
        >
          {isPublished
            ? t('tests.editor.unpublish')
            : t('tests.editor.publish')}
        </MyButton>
      </div>

      {test.lockedAt && (
        <Alert status="warning" className="w-full">
          <AlertIndicator />
          <AlertContent>
            <AlertDescription>
              {t('tests.editor.lockedBanner')}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
};

export default EditorHeader;
