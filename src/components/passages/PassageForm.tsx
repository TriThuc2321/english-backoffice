import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import type { CreateEditPassageFormData } from '@/schemas/passage';

import Section from '@/components/shared/Section';
import { MarkedBy, Status } from '@/types/common';

type PassageFormProps = {
  form: UseFormReturn<CreateEditPassageFormData>;
  onSubmit: (data: CreateEditPassageFormData) => void;
  isSubmitting?: boolean;
  onStatusChange?: (status: Status) => Promise<unknown>;
  isStatusSubmitting?: boolean;
  onCancel?: () => void;
};

const PassageForm = ({
  form,
  onSubmit,
  isSubmitting,
  onStatusChange,
  isStatusSubmitting,
  onCancel,
}: PassageFormProps) => {
  const { t } = useTranslation();

  const markedByItems = [
    { label: t('passages.form.markedBy.alphabet'), value: MarkedBy.ALPHABET },
    { label: t('passages.form.markedBy.number'), value: MarkedBy.NUMBER },
    { label: t('passages.form.markedBy.none'), value: MarkedBy.NONE },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paragraphs',
  });

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
            >
              <Label>{t('passages.form.title')}</Label>
              <Input ref={field.ref} placeholder={t('passages.form.title')} />
              <FieldError>{errors.title?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="markedBy"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('passages.form.markedBy.label')}
              fullWidth
              selectedKey={field.value}
              onSelectionChange={(key) => {
                if (key == null) return;
                field.onChange(key as MarkedBy);
              }}
              isInvalid={!!errors.markedBy}
            >
              <Label>{t('passages.form.markedBy.label')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {markedByItems.map((item) => (
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
              <FieldError>{errors.markedBy?.message}</FieldError>
            </Select>
          )}
        />

        <Controller
          name="subtitle"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.subtitle}
              className="col-span-2"
            >
              <Label>{t('passages.form.subtitle')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('passages.form.subtitle')}
              />
              <FieldError>{errors.subtitle?.message}</FieldError>
            </TextField>
          )}
        />
      </Section>

      <Section title={t('passages.form.paragraphs')} columns={1}>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onPress={() => append({ content: '' })}
          >
            <LuPlus className="size-4" />
            {t('passages.form.addParagraph')}
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <Controller
              name={`paragraphs.${index}.content`}
              control={control}
              render={({ field: f }) => (
                <TextField
                  fullWidth
                  name={f.name}
                  value={f.value ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                  isInvalid={!!errors.paragraphs?.[index]?.content}
                >
                  <TextArea ref={f.ref} rows={8} />
                  <FieldError>
                    {errors.paragraphs?.[index]?.content?.message}
                  </FieldError>
                </TextField>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              isIconOnly
              size="sm"
              onPress={() => remove(index)}
              className="mt-1"
            >
              <LuTrash2 className="text-danger size-4" />
            </Button>
          </div>
        ))}
      </Section>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onPress={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
        {onStatusChange && (
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              const nextStatus =
                field.value === Status.PUBLISHED
                  ? Status.DRAFT
                  : Status.PUBLISHED;

              return (
                <Button
                  type="button"
                  variant={
                    field.value === Status.PUBLISHED ? 'danger-soft' : 'outline'
                  }
                  isPending={isStatusSubmitting}
                  isDisabled={isSubmitting}
                  onPress={async () => {
                    try {
                      await onStatusChange(nextStatus);
                      field.onChange(nextStatus);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  {field.value === Status.PUBLISHED
                    ? t('passages.form.unpublish')
                    : t('passages.form.publish')}
                </Button>
              );
            }}
          />
        )}
        <Button
          type="submit"
          variant="primary"
          isPending={isSubmitting}
          isDisabled={isStatusSubmitting}
        >
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default PassageForm;
