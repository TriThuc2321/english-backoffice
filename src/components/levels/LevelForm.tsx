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

import type { CreateEditLevelFormData } from '@/schemas/level';

import Section from '@/components/shared/Section';
import { LevelStatus } from '@/types/level';

const STATUS_ITEMS = Object.values(LevelStatus)
  .filter((v) => v !== LevelStatus.DELETED)
  .map((v) => ({ label: v, value: v }));

type LevelFormProps = {
  form: UseFormReturn<CreateEditLevelFormData>;
  onSubmit: (data: CreateEditLevelFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const LevelForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: LevelFormProps) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('levels.form.basicInfo')}>
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
              <Label>{t('levels.form.code')}</Label>
              <Input ref={field.ref} placeholder={t('levels.form.code')} />
              <FieldError>{errors.code?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.name}
            >
              <Label>{t('levels.form.name')}</Label>
              <Input ref={field.ref} placeholder={t('levels.form.name')} />
              <FieldError>{errors.name?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="displayOrder"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v === '' ? undefined : Number(v))}
              onBlur={field.onBlur}
              isInvalid={!!errors.displayOrder}
            >
              <Label>{t('levels.form.displayOrder')}</Label>
              <Input ref={field.ref} type="number" min={0} />
              <FieldError>{errors.displayOrder?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('levels.form.status')}
              fullWidth
              selectedKey={field.value ?? null}
              onSelectionChange={(key) => {
                if (key == null) return;
                field.onChange(key as LevelStatus);
              }}
              isInvalid={!!errors.status}
            >
              <Label>{t('levels.form.status')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {STATUS_ITEMS.map((item) => (
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
              <FieldError>{errors.status?.message}</FieldError>
            </Select>
          )}
        />

        <Controller
          name="ageMin"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v === '' ? null : Number(v))}
              onBlur={field.onBlur}
              isInvalid={!!errors.ageMin}
            >
              <Label>{t('levels.form.ageMin')}</Label>
              <Input ref={field.ref} type="number" min={0} />
              <FieldError>{errors.ageMin?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="ageMax"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v === '' ? null : Number(v))}
              onBlur={field.onBlur}
              isInvalid={!!errors.ageMax}
            >
              <Label>{t('levels.form.ageMax')}</Label>
              <Input ref={field.ref} type="number" min={0} />
              <FieldError>{errors.ageMax?.message}</FieldError>
            </TextField>
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

export default LevelForm;
