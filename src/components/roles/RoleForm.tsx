import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextField,
} from '@heroui/react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateEditRoleFormData } from '@/schemas/role';

import Section from '@/components/shared/Section';
import { RoleStatus } from '@/types/role';

import PermissionSelector from './PermissionSelector';

type RoleFormProps = {
  form: UseFormReturn<CreateEditRoleFormData>;
  onSubmit: (data: CreateEditRoleFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

const RoleForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
}: RoleFormProps) => {
  const { t } = useTranslation();

  const statusItems = [
    { label: t('common.active'), value: RoleStatus.ACTIVE },
    { label: t('common.inactive'), value: RoleStatus.INACTIVE },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('common.basicInfo')}>
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
              <Label>{t('roles.form.name')}</Label>
              <Input ref={field.ref} />
              <FieldError>{errors.name?.message}</FieldError>
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
              <Label>{t('roles.form.code')}</Label>
              <Input ref={field.ref} />
              <FieldError>{errors.code?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              fullWidth
              selectedKey={field.value}
              onSelectionChange={(key) => {
                if (key == null) return;
                field.onChange(key as RoleStatus);
              }}
              isInvalid={!!errors.status}
            >
              <Label>{t('roles.form.status')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {statusItems.map((item) => (
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
          name="canAccessCms"
          control={control}
          render={({ field }) => (
            <Switch
              isSelected={field.value}
              onChange={field.onChange}
              className="inline-flex h-full w-full max-w-full flex-row-reverse items-center justify-between"
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <Label className="text-sm">
                  {t('roles.form.canAccessCms')}
                </Label>
              </Switch.Content>
            </Switch>
          )}
        />
      </Section>

      <Section title={t('roles.form.permissions')} columns={1}>
        <PermissionSelector control={control} />
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

export default RoleForm;
