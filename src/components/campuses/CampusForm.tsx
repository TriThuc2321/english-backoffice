import { Button, FieldError, Input, Label, TextField } from '@heroui/react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateEditCampusFormData } from '@/schemas/campus';

import Section from '@/components/shared/Section';

type CampusFormProps = {
  form: UseFormReturn<CreateEditCampusFormData>;
  onSubmit: (data: CreateEditCampusFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const CampusForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: CampusFormProps) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('campuses.form.basicInfo')}>
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
              <Label>{t('campuses.form.code')}</Label>
              <Input ref={field.ref} placeholder={t('campuses.form.code')} />
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
              <Label>{t('campuses.form.name')}</Label>
              <Input ref={field.ref} placeholder={t('campuses.form.name')} />
              <FieldError>{errors.name?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.phone}
            >
              <Label>{t('campuses.form.phone')}</Label>
              <Input ref={field.ref} placeholder={t('campuses.form.phone')} />
              <FieldError>{errors.phone?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.address}
              className="col-span-2"
            >
              <Label>{t('campuses.form.address')}</Label>
              <Input ref={field.ref} placeholder={t('campuses.form.address')} />
              <FieldError>{errors.address?.message}</FieldError>
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

export default CampusForm;
