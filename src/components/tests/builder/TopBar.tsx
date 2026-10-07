import { Button, Chip, ListBox, Select } from '@heroui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { CreateEditTestFormData } from '@/schemas/test';
import type { Test } from '@/types/test';

import MyButton from '@/components/shared/Button';
import { publishStatusColorMap } from '@/components/tests/constants';
import { useEditTest } from '@/hooks/apis/tests';
import useCreateEditTestForm from '@/hooks/forms/useCreateEditTest';
import { PermissionAction, SubjectName } from '@/types/auth';
import { IELTSSkill, PublishStatus } from '@/types/test';

const SKILL_ITEMS = Object.values(IELTSSkill);

type TopBarProps = {
  id: string;
  test?: Test;
  totalQuestions: number;
  sectionCount: number;
};

const TopBar = ({ id, test, totalQuestions, sectionCount }: TopBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: editTest, isPending: isSaving } = useEditTest();
  const { mutateAsync: toggleStatus, isPending: isToggling } = useEditTest();

  const form = useCreateEditTestForm({
    defaultValues: {
      title: '',
      code: '',
      publishStatus: PublishStatus.DRAFT,
    },
  });
  const { control, handleSubmit, register } = form;

  useEffect(() => {
    if (!test) return;
    form.reset({
      title: test.title ?? '',
      code: test.code ?? '',
      skill: test.skill ?? undefined,
      type: test.type ?? undefined,
      band: test.band ?? '',
      durationMin: test.durationMin ?? undefined,
      totalQuestions: test.totalQuestions ?? undefined,
      publishStatus: test.publishStatus ?? PublishStatus.DRAFT,
    });
  }, [test, form]);

  const onSubmit = async (payload: CreateEditTestFormData) => {
    try {
      await editTest({ id, ...payload });
    } catch (error) {
      console.error(error);
    }
  };

  const publishStatus = test?.publishStatus ?? PublishStatus.DRAFT;

  const handleTogglePublish = async () => {
    const next =
      publishStatus === PublishStatus.PUBLISHED
        ? PublishStatus.DRAFT
        : PublishStatus.PUBLISHED;
    try {
      await toggleStatus({ id, publishStatus: next });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex shrink-0 flex-wrap items-center gap-3 border-b px-4 py-2.5"
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onPress={() => navigate('/tests')}
      >
        <LuChevronLeft className="size-4" />
        {t('tests.builder.backToTests')}
      </Button>

      <input
        {...register('code')}
        placeholder={t('tests.builder.codePlaceholder')}
        aria-label={t('tests.form.code')}
        className="bg-default-100 text-default-800 placeholder:text-default-400 focus:border-accent w-28 rounded-lg border border-transparent px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wide uppercase outline-none"
      />

      <input
        {...register('title')}
        placeholder={t('tests.builder.titlePlaceholder')}
        aria-label={t('tests.form.title')}
        className="text-default-900 placeholder:text-default-400 focus:border-b-accent min-w-40 flex-1 border-b-2 border-transparent bg-transparent px-1 py-1 text-lg font-semibold outline-none"
      />

      <Controller
        name="skill"
        control={control}
        render={({ field }) => (
          <Select
            aria-label={t('tests.builder.skill')}
            placeholder={t('tests.builder.skill')}
            className="w-36"
            selectedKey={field.value ?? null}
            onSelectionChange={(key) => field.onChange(key ?? undefined)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {SKILL_ITEMS.map((skill) => (
                  <ListBox.Item key={skill} id={skill} textValue={skill}>
                    {skill}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />

      <div className="ml-auto flex items-center gap-3">
        <span className="text-default-500 font-mono text-xs">
          {t('tests.builder.stats', {
            questions: totalQuestions,
            sections: sectionCount,
          })}
        </span>

        <Chip
          size="sm"
          variant="soft"
          color={publishStatusColorMap[publishStatus]}
        >
          <Chip.Label>{publishStatus}</Chip.Label>
        </Chip>

        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Tests}
          type="button"
          size="sm"
          variant={
            publishStatus === PublishStatus.DRAFT ? 'outline' : 'danger-soft'
          }
          isPending={isToggling}
          onPress={handleTogglePublish}
        >
          {publishStatus === PublishStatus.DRAFT
            ? t('tests.builder.publish')
            : t('tests.builder.unpublish')}
        </MyButton>

        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Tests}
          type="submit"
          size="sm"
          variant="primary"
          isPending={isSaving}
        >
          {t('tests.builder.save')}
        </MyButton>
      </div>
    </form>
  );
};

export default TopBar;
