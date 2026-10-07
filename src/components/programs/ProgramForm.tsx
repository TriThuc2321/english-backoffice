import {
  Button,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField,
} from '@heroui/react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateEditProgramFormData } from '@/schemas/program';

import Section from '@/components/shared/Section';

type ProgramFormProps = {
  form: UseFormReturn<CreateEditProgramFormData>;
  onSubmit: (data: CreateEditProgramFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const ProgramForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: ProgramFormProps) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('programs.form.basicInfo')}>
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
              <Label>{t('programs.form.code')}</Label>
              <Input ref={field.ref} placeholder={t('programs.form.code')} />
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
              <Label>{t('programs.form.name')}</Label>
              <Input ref={field.ref} placeholder={t('programs.form.name')} />
              <FieldError>{errors.name?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.description}
              className="col-span-2"
            >
              <Label>{t('programs.form.description')}</Label>
              <TextArea ref={field.ref} rows={5} />
              <FieldError>{errors.description?.message}</FieldError>
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

export default ProgramForm;
