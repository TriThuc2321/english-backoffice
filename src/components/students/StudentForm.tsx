import type { DateValue } from '@internationalized/date';

import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateEditStudentFormData } from '@/schemas/student';

import Section from '@/components/shared/Section';
import { Gender } from '@/types/common';
import { ParentRelationship, StudentSegment } from '@/types/student';

const SEGMENT_ITEMS = Object.values(StudentSegment).map((v) => ({
  label: v,
  value: v,
}));

const PARENT_RELATIONSHIP_ITEMS = Object.values(ParentRelationship).map(
  (v) => ({
    label: v,
    value: v,
  }),
);

type StudentFormProps = {
  form: UseFormReturn<CreateEditStudentFormData>;
  onSubmit: (data: CreateEditStudentFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
};

const StudentForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
  isEdit,
}: StudentFormProps) => {
  const { t } = useTranslation();

  const genderItems = [
    { label: t('cmsUsers.form.genderMale'), value: Gender.MALE },
    { label: t('cmsUsers.form.genderFemale'), value: Gender.FEMALE },
    { label: t('cmsUsers.form.genderOther'), value: Gender.OTHER },
  ];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const segment = watch('segment');
  const isKidSegment =
    segment === StudentSegment.KIDS || segment === StudentSegment.TEENS;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('students.form.basicInfo')}>
        <Controller
          name="studentCode"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.studentCode}
              isDisabled={isEdit}
            >
              <Label>{t('students.form.studentCode')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('students.form.studentCodePlaceholder')}
              />
              <FieldError>{errors.studentCode?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.firstName}
            >
              <Label>{t('students.form.firstName')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('students.form.firstName')}
              />
              <FieldError>{errors.firstName?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              <Label>{t('students.form.lastName')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('students.form.lastName')}
              />
            </TextField>
          )}
        />

        <Controller
          name="segment"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('students.form.segment')}
              fullWidth
              selectedKey={field.value}
              onSelectionChange={(key) => {
                if (key == null) return;
                field.onChange(key as StudentSegment);
              }}
              isInvalid={!!errors.segment}
            >
              <Label>{t('students.form.segment')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {SEGMENT_ITEMS.map((item) => (
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
              <FieldError>{errors.segment?.message}</FieldError>
            </Select>
          )}
        />

        <Controller
          name="entryLevelCode"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              <Label>{t('students.form.entryLevelCode')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('students.form.entryLevelCodePlaceholder')}
              />
            </TextField>
          )}
        />
      </Section>

      <Section title={t('students.form.contactInfo')}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.email}
            >
              <Label>{t('students.form.email')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('students.form.email')}
                type="email"
              />
              <FieldError>{errors.email?.message}</FieldError>
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
            >
              <Label>{t('students.form.phone')}</Label>
              <Input ref={field.ref} placeholder={t('students.form.phone')} />
            </TextField>
          )}
        />

        <Controller
          name="dob"
          control={control}
          render={({ field }) => (
            <DatePicker
              className="w-full"
              name={field.name}
              value={field.value ? parseDate(field.value.split('T')[0]) : null}
              onChange={(date: DateValue | null) =>
                field.onChange(date?.toString() ?? '')
              }
            >
              <Label>{t('students.form.dob')}</Label>
              <DateField.Group fullWidth ref={field.ref}>
                <DateField.Input>
                  {(seg) => <DateField.Segment segment={seg} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger>
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <DatePicker.Popover>
                <Calendar aria-label="Date of birth">
                  <Calendar.Header>
                    <Calendar.YearPickerTrigger>
                      <Calendar.YearPickerTriggerHeading />
                      <Calendar.YearPickerTriggerIndicator />
                    </Calendar.YearPickerTrigger>
                    <Calendar.NavButton slot="previous" />
                    <Calendar.NavButton slot="next" />
                  </Calendar.Header>
                  <Calendar.Grid>
                    <Calendar.GridHeader>
                      {(day) => (
                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                      )}
                    </Calendar.GridHeader>
                    <Calendar.GridBody>
                      {(date) => <Calendar.Cell date={date} />}
                    </Calendar.GridBody>
                  </Calendar.Grid>
                  <Calendar.YearPickerGrid>
                    <Calendar.YearPickerGridBody>
                      {({ year }) => <Calendar.YearPickerCell year={year} />}
                    </Calendar.YearPickerGridBody>
                  </Calendar.YearPickerGrid>
                </Calendar>
              </DatePicker.Popover>
            </DatePicker>
          )}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('cmsUsers.form.gender')}
              fullWidth
              selectedKey={field.value ?? null}
              onSelectionChange={(key) => {
                field.onChange(key ?? null);
              }}
            >
              <Label>{t('cmsUsers.form.gender')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {genderItems.map((item) => (
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

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className="col-span-2"
            >
              <Label>{t('students.form.note')}</Label>
              <TextArea
                ref={field.ref}
                placeholder={t('students.form.note')}
                rows={3}
              />
            </TextField>
          )}
        />
      </Section>

      {isKidSegment && (
        <Section title={t('students.form.parentInfo')}>
          <Controller
            name="parentName"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.parentName}
              >
                <Label>{t('students.form.parentName')}</Label>
                <Input
                  ref={field.ref}
                  placeholder={t('students.form.parentName')}
                />
                <FieldError>{errors.parentName?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="parentPhone"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.parentPhone}
              >
                <Label>{t('students.form.parentPhone')}</Label>
                <Input
                  ref={field.ref}
                  placeholder={t('students.form.parentPhone')}
                />
                <FieldError>{errors.parentPhone?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="parentEmail"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                name={field.name}
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isInvalid={!!errors.parentEmail}
              >
                <Label>{t('students.form.parentEmail')}</Label>
                <Input
                  ref={field.ref}
                  placeholder={t('students.form.parentEmail')}
                  type="email"
                />
                <FieldError>{errors.parentEmail?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="parentRelationship"
            control={control}
            render={({ field }) => (
              <Select
                placeholder={t('students.form.parentRelationship')}
                fullWidth
                selectedKey={field.value ?? null}
                onSelectionChange={(key) => {
                  field.onChange(key ?? null);
                }}
              >
                <Label>{t('students.form.parentRelationship')}</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {PARENT_RELATIONSHIP_ITEMS.map((item) => (
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
      )}

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

export default StudentForm;
