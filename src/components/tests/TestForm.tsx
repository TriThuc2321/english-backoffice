import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateTestFormData, CreateTestFormInput } from '@/schemas/test';

import Section from '@/components/shared/Section';
import { ExamType } from '@/types/test';

import { getSectionDefaults } from './constants';

type TestFormProps = {
  form: UseFormReturn<CreateTestFormInput, unknown, CreateTestFormData>;
  onSubmit: (data: CreateTestFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const toNumber = (v: string) => (v === '' ? undefined : Number(v));

const TestForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: TestFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, replace } = useFieldArray({ control, name: 'sections' });

  const sectionsError =
    errors.sections?.root?.message ?? errors.sections?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('common.basicInfo')}>
        <Controller
          name="examType"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('tests.form.examType')}
              fullWidth
              selectedKey={field.value}
              onSelectionChange={(key) => {
                if (key == null || key === field.value) return;
                field.onChange(key as ExamType);
                replace(getSectionDefaults(key as ExamType));
              }}
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
          name="slug"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.slug}
            >
              <Label>{t('tests.form.slug')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('tests.form.slugPlaceholder')}
              />
              <FieldError>{errors.slug?.message}</FieldError>
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
      </Section>

      <Section title={t('tests.form.sections')} columns={1}>
        <p className="text-muted -mt-2 text-sm">
          {t('tests.form.sectionsHint')}
        </p>
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="border-default rounded-field flex items-center gap-3 border px-3 py-2"
          >
            <Controller
              name={`sections.${index}.enabled`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  className="flex-1"
                  isSelected={!!field.value}
                  onChange={field.onChange}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label>{t(`tests.skill.${item.skill}`)}</Label>
                  </Checkbox.Content>
                </Checkbox>
              )}
            />
            <Controller
              name={`sections.${index}.durationMinutes`}
              control={control}
              render={({ field }) => (
                <TextField
                  className="w-36"
                  aria-label={t('tests.form.sectionDuration')}
                  name={field.name}
                  value={field.value != null ? String(field.value) : ''}
                  onChange={(v) => field.onChange(toNumber(v))}
                  onBlur={field.onBlur}
                  isInvalid={!!errors.sections?.[index]?.durationMinutes}
                >
                  <Input
                    ref={field.ref}
                    type="number"
                    min={1}
                    placeholder={t('tests.form.minutes')}
                  />
                </TextField>
              )}
            />
          </div>
        ))}
        {sectionsError && (
          <p className="text-danger text-sm">{sectionsError}</p>
        )}
      </Section>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onPress={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" variant="primary" isPending={isSubmitting}>
          {t('tests.form.submit')}
        </Button>
      </div>
    </form>
  );
};

export default TestForm;
