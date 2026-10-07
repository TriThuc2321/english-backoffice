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
  TextField,
} from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import type { CreateEditTeacherFormData } from '@/schemas/teacher';

import Section from '@/components/shared/Section';
import { Gender } from '@/types/common';
import { SkillArea, SkillLevel, SkillTargetAudience } from '@/types/teacher';

const TARGET_AUDIENCE_ITEMS = Object.values(SkillTargetAudience).map((v) => ({
  label: v,
  value: v,
}));

const SKILL_AREA_ITEMS = Object.values(SkillArea).map((v) => ({
  label: v,
  value: v,
}));

const SKILL_LEVEL_ITEMS = Object.values(SkillLevel).map((v) => ({
  label: v,
  value: v,
}));

type TeacherFormProps = {
  form: UseFormReturn<CreateEditTeacherFormData>;
  onSubmit: (data: CreateEditTeacherFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
};

const TeacherForm = ({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
  isEdit,
}: TeacherFormProps) => {
  const { t } = useTranslation();

  const genderItems = [
    { label: t('cmsUsers.form.genderMale'), value: Gender.MALE },
    { label: t('cmsUsers.form.genderFemale'), value: Gender.FEMALE },
    { label: t('cmsUsers.form.genderOther'), value: Gender.OTHER },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'skills' });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: 'certificates' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Section title={t('teachers.form.basicInfo')}>
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
              <Label>{t('teachers.form.code')}</Label>
              <Input ref={field.ref} placeholder={t('teachers.form.code')} />
              <FieldError>{errors.code?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.nationality}
            >
              <Label>{t('teachers.form.nationality')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('teachers.form.nationality')}
              />
              <FieldError>{errors.nationality?.message}</FieldError>
            </TextField>
          )}
        />
      </Section>

      <Section title={t('teachers.form.userInfo')}>
        <Controller
          name="user.firstName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.user?.firstName}
            >
              <Label>{t('cmsUsers.form.firstName')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('cmsUsers.form.firstName')}
              />
              <FieldError>{errors.user?.firstName?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="user.lastName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.user?.lastName}
            >
              <Label>{t('cmsUsers.form.lastName')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('cmsUsers.form.lastName')}
              />
              <FieldError>{errors.user?.lastName?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="user.email"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.user?.email}
              isDisabled={isEdit}
            >
              <Label>{t('cmsUsers.form.email')}</Label>
              <Input
                ref={field.ref}
                placeholder={t('cmsUsers.form.email')}
                type="email"
              />
              <FieldError>{errors.user?.email?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="user.phone"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.user?.phone}
            >
              <Label>{t('cmsUsers.form.phone')}</Label>
              <Input ref={field.ref} placeholder={t('cmsUsers.form.phone')} />
              <FieldError>{errors.user?.phone?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          name="user.dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              className="w-full"
              name={field.name}
              value={field.value ? parseDate(field.value.split('T')[0]) : null}
              onChange={(date: DateValue | null) =>
                field.onChange(date?.toString() ?? undefined)
              }
              isInvalid={!!errors.user?.dateOfBirth}
            >
              <Label>{t('cmsUsers.form.dateOfBirth')}</Label>
              <DateField.Group fullWidth ref={field.ref}>
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger>
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <FieldError>{errors.user?.dateOfBirth?.message}</FieldError>
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
          name="user.gender"
          control={control}
          render={({ field }) => (
            <Select
              placeholder={t('cmsUsers.form.gender')}
              fullWidth
              selectedKey={field.value ?? null}
              onSelectionChange={(key) => {
                field.onChange(key ?? null);
              }}
              isInvalid={!!errors.user?.gender}
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
              <FieldError>{errors.user?.gender?.message}</FieldError>
            </Select>
          )}
        />

        <Controller
          name="user.address"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isInvalid={!!errors.user?.address}
              className="col-span-2"
            >
              <Label>{t('cmsUsers.form.address')}</Label>
              <Input ref={field.ref} placeholder={t('cmsUsers.form.address')} />
              <FieldError>{errors.user?.address?.message}</FieldError>
            </TextField>
          )}
        />
      </Section>

      <Section title={t('teachers.form.skills')} columns={1}>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onPress={() =>
              appendSkill({
                level: SkillLevel.BASIC,
                targetAudience: null,
                skillArea: null,
              })
            }
          >
            <LuPlus className="size-4" />
            {t('teachers.form.addSkill')}
          </Button>
        </div>

        {skillFields.map((field, index) => (
          <div
            key={field.id}
            className="relative grid grid-cols-3 gap-3 rounded-lg border p-4"
          >
            <Button
              type="button"
              variant="ghost"
              isIconOnly
              size="sm"
              onPress={() => removeSkill(index)}
              className="absolute top-2 right-2"
            >
              <LuTrash2 className="text-danger size-4" />
            </Button>

            <Controller
              name={`skills.${index}.targetAudience`}
              control={control}
              render={({ field: f }) => (
                <Select
                  placeholder={t('teachers.form.targetAudience')}
                  fullWidth
                  selectedKey={f.value ?? null}
                  onSelectionChange={(key) => f.onChange(key ?? null)}
                >
                  <Label>{t('teachers.form.targetAudience')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {TARGET_AUDIENCE_ITEMS.map((item) => (
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
              name={`skills.${index}.skillArea`}
              control={control}
              render={({ field: f }) => (
                <Select
                  placeholder={t('teachers.form.skillArea')}
                  fullWidth
                  selectedKey={f.value ?? null}
                  onSelectionChange={(key) => f.onChange(key ?? null)}
                >
                  <Label>{t('teachers.form.skillArea')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {SKILL_AREA_ITEMS.map((item) => (
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
              name={`skills.${index}.level`}
              control={control}
              render={({ field: f }) => (
                <Select
                  placeholder={t('teachers.form.skillLevel')}
                  fullWidth
                  selectedKey={f.value}
                  onSelectionChange={(key) => {
                    if (key == null) return;
                    f.onChange(key as SkillLevel);
                  }}
                  isInvalid={!!errors.skills?.[index]?.level}
                >
                  <Label>{t('teachers.form.skillLevel')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {SKILL_LEVEL_ITEMS.map((item) => (
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
                  <FieldError>
                    {errors.skills?.[index]?.level?.message}
                  </FieldError>
                </Select>
              )}
            />
          </div>
        ))}
      </Section>

      <Section title={t('teachers.form.certificates')} columns={1}>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onPress={() =>
              appendCert({
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                score: '',
                fileUrl: '',
              })
            }
          >
            <LuPlus className="size-4" />
            {t('teachers.form.addCertificate')}
          </Button>
        </div>

        {certFields.map((field, index) => (
          <div
            key={field.id}
            className="relative grid grid-cols-2 gap-3 rounded-lg border p-4"
          >
            <Button
              type="button"
              variant="ghost"
              isIconOnly
              size="sm"
              onPress={() => removeCert(index)}
              className="absolute top-2 right-2"
            >
              <LuTrash2 className="text-danger size-4" />
            </Button>

            <Controller
              name={`certificates.${index}.name`}
              control={control}
              render={({ field: f }) => (
                <TextField
                  fullWidth
                  name={f.name}
                  value={f.value ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                  isInvalid={!!errors.certificates?.[index]?.name}
                  className="col-span-2"
                >
                  <Label>{t('teachers.form.certName')}</Label>
                  <Input
                    ref={f.ref}
                    placeholder={t('teachers.form.certName')}
                  />
                  <FieldError>
                    {errors.certificates?.[index]?.name?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Controller
              name={`certificates.${index}.issuer`}
              control={control}
              render={({ field: f }) => (
                <TextField
                  fullWidth
                  name={f.name}
                  value={f.value ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                >
                  <Label>{t('teachers.form.certIssuer')}</Label>
                  <Input
                    ref={f.ref}
                    placeholder={t('teachers.form.certIssuer')}
                  />
                </TextField>
              )}
            />

            <Controller
              name={`certificates.${index}.score`}
              control={control}
              render={({ field: f }) => (
                <TextField
                  fullWidth
                  name={f.name}
                  value={f.value ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                >
                  <Label>{t('teachers.form.certScore')}</Label>
                  <Input
                    ref={f.ref}
                    placeholder={t('teachers.form.certScore')}
                  />
                </TextField>
              )}
            />

            <Controller
              name={`certificates.${index}.issueDate`}
              control={control}
              render={({ field: f }) => (
                <DatePicker
                  className="w-full"
                  name={f.name}
                  value={f.value ? parseDate(f.value.split('T')[0]) : null}
                  onChange={(date: DateValue | null) =>
                    f.onChange(date?.toString() ?? undefined)
                  }
                >
                  <Label>{t('teachers.form.certIssueDate')}</Label>
                  <DateField.Group fullWidth ref={f.ref}>
                    <DateField.Input>
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <DatePicker.Popover>
                    <Calendar aria-label="Issue date">
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
                          {({ year }) => (
                            <Calendar.YearPickerCell year={year} />
                          )}
                        </Calendar.YearPickerGridBody>
                      </Calendar.YearPickerGrid>
                    </Calendar>
                  </DatePicker.Popover>
                </DatePicker>
              )}
            />

            <Controller
              name={`certificates.${index}.expiryDate`}
              control={control}
              render={({ field: f }) => (
                <DatePicker
                  className="w-full"
                  name={f.name}
                  value={f.value ? parseDate(f.value.split('T')[0]) : null}
                  onChange={(date: DateValue | null) =>
                    f.onChange(date?.toString() ?? undefined)
                  }
                >
                  <Label>{t('teachers.form.certExpiryDate')}</Label>
                  <DateField.Group fullWidth ref={f.ref}>
                    <DateField.Input>
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <DatePicker.Popover>
                    <Calendar aria-label="Expiry date">
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
                          {({ year }) => (
                            <Calendar.YearPickerCell year={year} />
                          )}
                        </Calendar.YearPickerGridBody>
                      </Calendar.YearPickerGrid>
                    </Calendar>
                  </DatePicker.Popover>
                </DatePicker>
              )}
            />

            <Controller
              name={`certificates.${index}.fileUrl`}
              control={control}
              render={({ field: f }) => (
                <TextField
                  fullWidth
                  name={f.name}
                  value={f.value ?? ''}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                  className="col-span-2"
                >
                  <Label>{t('teachers.form.certFileUrl')}</Label>
                  <Input
                    ref={f.ref}
                    placeholder={t('teachers.form.certFileUrl')}
                  />
                </TextField>
              )}
            />
          </div>
        ))}
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

export default TeacherForm;
