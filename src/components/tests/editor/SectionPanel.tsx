import {
  Button,
  Card,
  Chip,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  Skeleton,
  TextField,
} from '@heroui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import type { TestSectionFormData } from '@/schemas/test';
import type { SkillType, Test, TestSection } from '@/types/test';

import MyButton from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import {
  useCreateTestPart,
  useDeleteTestPart,
  useGetTestParts,
  useReorderTestParts,
} from '@/hooks/apis/test-parts';
import {
  useDeleteTestSection,
  useEditTestSection,
} from '@/hooks/apis/test-sections';
import { useEditTestSectionForm } from '@/hooks/forms';
import { PermissionAction, SubjectName } from '@/types/auth';

import { SKILLS_BY_EXAM_TYPE } from '../constants';
import OrderButtons from './OrderButtons';
import { byOrder, moveId, toNumber } from './utils';

const toFormValues = (section: TestSection): TestSectionFormData => ({
  skill: section.skill,
  durationMinutes: section.durationMinutes ?? undefined,
});

type SectionInfoCardProps = {
  test: Test;
  section: TestSection;
  sections: TestSection[];
  onDeleted: () => void;
};

const SectionInfoCard = ({
  test,
  section,
  sections,
  onDeleted,
}: SectionInfoCardProps) => {
  const { t } = useTranslation();
  const isLocked = !!test.lockedAt;
  const { mutateAsync: editSection, isPending: isEditing } =
    useEditTestSection();
  const { mutateAsync: deleteSection, isPending: isDeleting } =
    useDeleteTestSection();

  const form = useEditTestSectionForm({ defaultValues: toFormValues(section) });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    reset(toFormValues(section));
  }, [section, reset]);

  // Each skill at most once per test
  const skillOptions = SKILLS_BY_EXAM_TYPE[test.examType].filter(
    (skill) =>
      skill === section.skill || !sections.some((s) => s.skill === skill),
  );

  const onSubmit = async (data: TestSectionFormData) => {
    try {
      await editSection({
        id: section.id,
        skill: data.skill !== section.skill ? data.skill : undefined,
        durationMinutes: data.durationMinutes,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteSection([section.id]);
      onDeleted();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-foreground/50 text-sm font-semibold uppercase">
              {t(`tests.skill.${section.skill}`)}
            </h3>
            {!isLocked && (
              <ConfirmWrapper
                isDisabled={isDeleting}
                title={t('tests.editor.deleteSection')}
                description={t('tests.editor.deleteSectionConfirm', {
                  skill: t(`tests.skill.${section.skill}`),
                })}
                onConfirm={onDelete}
              >
                <MyButton
                  I={PermissionAction.Delete}
                  a={SubjectName.Tests}
                  size="sm"
                  variant="ghost"
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <LuTrash2 className="size-4" />
                  {t('tests.editor.deleteSection')}
                </MyButton>
              </ConfirmWrapper>
            )}
          </div>

          <Section>
            <Controller
              name="skill"
              control={control}
              render={({ field }) => (
                <Select
                  fullWidth
                  selectedKey={field.value}
                  onSelectionChange={(key) =>
                    key != null && field.onChange(key as SkillType)
                  }
                  isDisabled={isLocked}
                  isInvalid={!!errors.skill}
                >
                  <Label>{t('tests.form.skill')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {skillOptions.map((value) => (
                        <ListBox.Item
                          key={value}
                          id={value}
                          textValue={t(`tests.skill.${value}`)}
                        >
                          {t(`tests.skill.${value}`)}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError>{errors.skill?.message}</FieldError>
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
                  isDisabled={isLocked}
                  isInvalid={!!errors.durationMinutes}
                >
                  <Label>{t('tests.form.sectionDuration')}</Label>
                  <Input ref={field.ref} type="number" min={1} />
                  <FieldError>{errors.durationMinutes?.message}</FieldError>
                </TextField>
              )}
            />
          </Section>

          {!isLocked && (
            <div className="flex justify-end">
              <MyButton
                I={PermissionAction.Update}
                a={SubjectName.Tests}
                type="submit"
                variant="primary"
                isPending={isEditing}
                isDisabled={!isDirty}
              >
                {t('tests.editor.save')}
              </MyButton>
            </div>
          )}
        </form>
      </Card.Content>
    </Card>
  );
};

type PartsCardProps = {
  test: Test;
  section: TestSection;
  onOpenPart: (partId: number) => void;
};

const PartsCard = ({ test, section, onOpenPart }: PartsCardProps) => {
  const { t } = useTranslation();
  const isLocked = !!test.lockedAt;
  const { data, isLoading } = useGetTestParts(section.id);
  const { mutate: createPart, isPending: isCreating } = useCreateTestPart();
  const { mutate: deletePart, isPending: isDeleting } = useDeleteTestPart();
  const { mutate: reorder, isPending: isReordering } = useReorderTestParts();

  const parts = byOrder(data ?? []);
  const partName = (title: string | null, index: number) =>
    title || t('tests.editor.partFallback', { n: index + 1 });

  return (
    <Card>
      <Card.Content className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-foreground/50 text-sm font-semibold uppercase">
            {t('tests.editor.parts')}
          </h3>
          {!isLocked && (
            <MyButton
              I={PermissionAction.Create}
              a={SubjectName.Tests}
              size="sm"
              variant="outline"
              isPending={isCreating}
              onPress={() =>
                createPart({
                  sectionId: section.id,
                  title: t('tests.editor.partFallback', {
                    n: parts.length + 1,
                  }),
                })
              }
            >
              <LuPlus className="size-4" />
              {t('tests.editor.addPart')}
            </MyButton>
          )}
        </div>

        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="rounded-field h-12" />
          ))}

        {!isLoading && parts.length === 0 && (
          <div className="text-muted rounded-3xl border py-6 text-center text-sm">
            {t('tests.editor.noParts')}
          </div>
        )}

        {parts.map((part, index) => (
          <div
            key={part.id}
            className="rounded-field flex items-center gap-3 border px-3 py-2"
          >
            <OrderButtons
              index={index}
              count={parts.length}
              isDisabled={isLocked || isReordering}
              onMove={(offset) =>
                reorder({
                  sectionId: section.id,
                  ids: moveId(parts, index, offset),
                })
              }
            />
            <span className="flex-1 truncate font-semibold">
              {partName(part.title, index)}
            </span>
            <Chip
              size="sm"
              variant="soft"
              color={part.audioMediaId ? 'success' : 'warning'}
            >
              <Chip.Label>
                {part.audioMediaId
                  ? t('tests.editor.audioSet')
                  : t('tests.editor.noAudio')}
              </Chip.Label>
            </Chip>
            <Button
              size="sm"
              variant="ghost"
              onPress={() => onOpenPart(part.id)}
            >
              {t('tests.editor.open')}
            </Button>
            {!isLocked && (
              <ConfirmWrapper
                isDisabled={isDeleting}
                title={t('tests.editor.deletePart')}
                description={t('tests.editor.deletePartConfirm', {
                  name: partName(part.title, index),
                })}
                onConfirm={() => deletePart([part.id])}
              >
                <MyButton
                  I={PermissionAction.Delete}
                  a={SubjectName.Tests}
                  isIconOnly
                  size="sm"
                  variant="outline"
                  isDisabled={isDeleting}
                >
                  <LuTrash2 className="text-danger size-4" />
                </MyButton>
              </ConfirmWrapper>
            )}
          </div>
        ))}
      </Card.Content>
    </Card>
  );
};

type SectionPanelProps = SectionInfoCardProps & {
  onOpenPart: (partId: number) => void;
};

const SectionPanel = ({ onOpenPart, ...props }: SectionPanelProps) => (
  <div className="flex flex-col gap-4">
    <SectionInfoCard {...props} />
    <PartsCard
      test={props.test}
      section={props.section}
      onOpenPart={onOpenPart}
    />
  </div>
);

export default SectionPanel;
