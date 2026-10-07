import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from '@heroui/react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateEditTestFormData } from '@/schemas/test';

import Section from '@/components/shared/Section';
import { IELTSSkill } from '@/types/test';

const SKILL_ITEMS = Object.values(IELTSSkill).map((v) => ({
  label: v,
  value: v,
}));

type TestFormProps = {
  form: UseFormReturn<CreateEditTestFormData>;
  onSubmit: (data: CreateEditTestFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('common.basicInfo')}>
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
              className="col-span-2"
            >
              <Label>{t('tests.form.title')}</Label>
              <Input ref={field.ref} placeholder={t('tests.form.title')} />
              <FieldError>{errors.title?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.code}
            >
              <Label>{t('tests.form.code')}</Label>
              <Input ref={field.ref} placeholder={t('tests.form.code')} />
              <FieldError>{errors.code?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="skill"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('tests.form.skill')}
              fullWidth
              selectedKey={field.value ?? null}
              onSelectionChange={(key) => field.onChange(key ?? undefined)}
            >
              <Label>{t('tests.form.skill')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {SKILL_ITEMS.map((item) => (
                    <ListBox.Item
                      key={item.value}
                      id={item.value}
                      textValue={item.label}
                    >
                      {item.label}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          )}
        />
      </Section>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onPress={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" variant="primary" isPending={isSubmitting}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default TestForm;
