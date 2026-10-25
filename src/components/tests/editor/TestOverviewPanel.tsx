import {
  Button,
  Card,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { EditTestFormData } from '@/schemas/test';
import type { EditTestPayload, Test, TestSection } from '@/types/test';

import MyButton from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { useReorderTestSections } from '@/hooks/apis/test-sections';
import { useEditTest } from '@/hooks/apis/tests';
import { useEditTestForm } from '@/hooks/forms';
import { PermissionAction, SubjectName } from '@/types/auth';
import { ExamType } from '@/types/test';

import OrderButtons from './OrderButtons';
import { moveId, toNumber } from './utils';

const toFormValues = (test: Test): EditTestFormData => ({
  examType: test.examType,
  title: test.title,
  source: test.source ?? '',
  durationMinutes: test.durationMinutes ?? undefined,
});

const TestInfoCard = ({ test }: { test: Test }) => {
  const { t } = useTranslation();
  const { mutateAsync: editTest, isPending } = useEditTest();
  const isLocked = !!test.lockedAt;

  const form = useEditTestForm({ defaultValues: toFormValues(test) });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(toFormValues(test));
  }, [test, reset]);

  const onSubmit = async (data: EditTestFormData) => {
    // Only send documented fields; examType is fixed once the test is locked
    const payload: EditTestPayload = {
      id: test.id,
      title: data.title,
      source: data.source.trim(),
      durationMinutes: data.durationMinutes,
    };
    if (!isLocked && data.examType !== test.examType)
      payload.examType = data.examType;

    try {
      await editTest(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Section title={t('tests.editor.testInfo')}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.title}
                >
                  <Label>{t('tests.form.title')}</Label>
                  <Input
                    ref={field.ref}
                    placeholder={t('tests.form.titlePlaceholder')}
                  />
                  <FieldError>{errors.title?.message}</FieldError>
                </TextField>
              )}
            />

            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.source}
                >
                  <Label>{t('tests.form.source')}</Label>
                  <Input
                    ref={field.ref}
                    placeholder={t('tests.form.sourcePlaceholder')}
                  />
                  <FieldError>{errors.source?.message}</FieldError>
                </TextField>
              )}
            />

            <Controller
              name="examType"
              control={control}
              render={({ field }) => (
                <Select
                  fullWidth
                  selectedKey={field.value}
                  onSelectionChange={(key) =>
                    key != null && field.onChange(key as ExamType)
                  }
                  isDisabled={isLocked}
                  isInvalid={!!errors.examType}
                >
                  <Label>{t('tests.form.examType')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {Object.values(ExamType).map((value) => (
                        <ListBox.Item
                          key={value}
                          id={value}
                          textValue={t(`tests.examType.${value}`)}
                        >
                          {t(`tests.examType.${value}`)}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError>{errors.examType?.message}</FieldError>
                </Select>
              )}
            />

            <Controller
              name="durationMinutes"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  name={field.name}
                  value={field.value != null ? String(field.value) : ''}
                  onChange={(v) => field.onChange(toNumber(v))}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.durationMinutes}
                >
                  <Label>{t('tests.form.durationMinutes')}</Label>
                  <Input ref={field.ref} type="number" min={1} />
                  <FieldError>{errors.durationMinutes?.message}</FieldError>
                </TextField>
              )}
            />
          </Section>

          <div className="flex justify-end">
            <MyButton
              I={PermissionAction.Update}
              a={SubjectName.Tests}
              type="submit"
              variant="primary"
              isPending={isPending}
              isDisabled={!isDirty}
            >
              {t('tests.editor.save')}
            </MyButton>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

type SectionsCardProps = {
  test: Test;
  sections: TestSection[];
  onOpen: (sectionId: number) => void;
};

const SectionsCard = ({ test, sections, onOpen }: SectionsCardProps) => {
  const { t } = useTranslation();
  const { mutate: reorder, isPending } = useReorderTestSections();

  return (
    <Card>
      <Card.Content className="flex flex-col gap-3">
        <h3 className="text-foreground/50 text-sm font-semibold uppercase">
          {t('tests.editor.sections')}
        </h3>

        {sections.length === 0 && (
          <div className="text-muted rounded-3xl border py-6 text-center text-sm">
            {t('tests.editor.noSections')}
          </div>
        )}

        {sections.map((section, index) => (
          <div
            key={section.id}
            className="rounded-field flex items-center gap-3 border px-3 py-2"
          >
            <OrderButtons
              index={index}
              count={sections.length}
              isDisabled={!!test.lockedAt || isPending}
              onMove={(offset) =>
                reorder({
                  testId: test.id,
                  ids: moveId(sections, index, offset),
                })
              }
            />
            <span className="flex-1 font-semibold">
              {t(`tests.skill.${section.skill}`)}
            </span>
            <span className="text-muted text-sm">
              {section.durationMinutes != null
                ? t('tests.minutesShort', { count: section.durationMinutes })
                : '-'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => onOpen(section.id)}
            >
              {t('tests.editor.open')}
            </Button>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
};

type TestOverviewPanelProps = SectionsCardProps;

const TestOverviewPanel = (props: TestOverviewPanelProps) => (
  <div className="flex flex-col gap-4">
    <TestInfoCard test={props.test} />
    <SectionsCard {...props} />
  </div>
);

export default TestOverviewPanel;
