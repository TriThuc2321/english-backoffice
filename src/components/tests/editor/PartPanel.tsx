import { Button, Card, Chip, Dropdown, Skeleton } from '@heroui/react';
import { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import type { TestPartFormData } from '@/schemas/test';
import type {
  QuestionGroup,
  QuestionType,
  SkillType,
  Test,
  TestPart,
  TestSection,
} from '@/types/test';

import MyButton from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { getTypesForSkill } from '@/constants/questionTypes';
import {
  useDeleteQuestionGroup,
  useGetQuestionGroupById,
  useGetQuestionGroups,
  useReorderQuestionGroups,
} from '@/hooks/apis/question-groups';
import { useDeleteTestPart, useEditTestPart } from '@/hooks/apis/test-parts';
import { useEditTestPartForm } from '@/hooks/forms';
import { PermissionAction, SubjectName } from '@/types/auth';
import { MediaKind } from '@/types/test';

import type { EditorLocation } from './TestEditor';

import { NumberInput, TextInput } from './fields';
import { groupRange } from './groupForm';
import MediaPicker from './MediaPicker';
import OrderButtons from './OrderButtons';
import { byOrder, moveId } from './utils';

const toFormValues = (part: TestPart): TestPartFormData => ({
  title: part.title ?? '',
  instruction: part.instruction ?? '',
  audioMediaId: part.audioMediaId ?? undefined,
  audioStartMs: part.audioStartMs ?? undefined,
  audioEndMs: part.audioEndMs ?? undefined,
});

type PartPanelProps = {
  test: Test;
  section: TestSection;
  part: TestPart;
  partName: string;
  onNavigate: (location: EditorLocation) => void;
};

const PartInfoCard = ({
  test,
  section,
  part,
  partName,
  onNavigate,
}: PartPanelProps) => {
  const { t } = useTranslation();
  const isLocked = !!test.lockedAt;
  const { mutateAsync: editPart, isPending: isEditing } = useEditTestPart();
  const { mutateAsync: deletePart, isPending: isDeleting } =
    useDeleteTestPart();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useEditTestPartForm({ defaultValues: toFormValues(part) });

  // A background refetch must not wipe unsaved edits
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;
  useEffect(() => {
    if (isDirtyRef.current) return;
    reset(toFormValues(part));
  }, [part, reset]);

  const onSubmit = async (data: TestPartFormData) => {
    try {
      await editPart({
        id: part.id,
        title: data.title.trim() || null,
        instruction: data.instruction.trim() || null,
        audioMediaId: data.audioMediaId ?? null,
        audioStartMs: data.audioStartMs ?? null,
        audioEndMs: data.audioEndMs ?? null,
      });
      reset(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deletePart([part.id]);
      onNavigate({ section: section.id });
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
              {t(`tests.skill.${section.skill}`)} › {partName}
            </h3>
            {!isLocked && (
              <ConfirmWrapper
                isDisabled={isDeleting}
                title={t('tests.editor.deletePart')}
                description={t('tests.editor.deletePartConfirm', {
                  name: partName,
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
                  {t('tests.editor.deletePart')}
                </MyButton>
              </ConfirmWrapper>
            )}
          </div>

          <Section>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextInput
                  className="sm:col-span-2"
                  label={t('tests.editor.part.title')}
                  placeholder={partName}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.title?.message}
                  isDisabled={isLocked}
                />
              )}
            />
            <Controller
              name="instruction"
              control={control}
              render={({ field }) => (
                <TextInput
                  multiline
                  className="sm:col-span-2"
                  label={t('tests.editor.part.instruction')}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
            <Controller
              name="audioMediaId"
              control={control}
              render={({ field }) => (
                <MediaPicker
                  testId={test.id}
                  kind={MediaKind.AUDIO}
                  label={t('tests.editor.audioMediaId')}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.audioMediaId?.message}
                  isDisabled={isLocked}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="audioStartMs"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label={t('tests.editor.part.audioStartMs')}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.audioStartMs?.message}
                    isDisabled={isLocked}
                  />
                )}
              />
              <Controller
                name="audioEndMs"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label={t('tests.editor.part.audioEndMs')}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.audioEndMs?.message}
                    isDisabled={isLocked}
                  />
                )}
              />
            </div>
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

type GroupRowProps = {
  group: QuestionGroup;
  index: number;
  count: number;
  isLocked: boolean;
  isReordering: boolean;
  onMove: (offset: -1 | 1) => void;
  onOpen: () => void;
};

const GroupRow = ({
  group,
  index,
  count,
  isLocked,
  isReordering,
  onMove,
  onOpen,
}: GroupRowProps) => {
  const { t } = useTranslation();
  const { data: detail } = useGetQuestionGroupById(group.id);
  const { mutate: deleteGroup, isPending: isDeleting } =
    useDeleteQuestionGroup();
  const range = groupRange(detail?.questions);

  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
      <OrderButtons
        index={index}
        count={count}
        isDisabled={isLocked || isReordering}
        onMove={onMove}
      />
      <Chip size="sm" variant="soft">
        <Chip.Label>
          {range
            ? t('tests.editor.group.questionRange', range)
            : t('tests.editor.group.noQuestions')}
        </Chip.Label>
      </Chip>
      <span className="flex-1 truncate">
        <b>{t(`tests.questionType.${group.questionType}`)}</b>
        {group.instruction && (
          <span className="text-muted text-sm"> · {group.instruction}</span>
        )}
      </span>
      <Button size="sm" variant="ghost" onPress={onOpen}>
        {t('tests.editor.edit')}
      </Button>
      {!isLocked && (
        <ConfirmWrapper
          isDisabled={isDeleting}
          title={t('tests.editor.group.delete')}
          description={t('tests.editor.group.deleteConfirm')}
          onConfirm={() => deleteGroup([group.id])}
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
  );
};

const AddGroupMenu = ({
  skill,
  onSelect,
}: {
  skill: SkillType;
  onSelect: (type: QuestionType) => void;
}) => {
  const { t } = useTranslation();
  const ability = useCan();
  if (!ability.can(PermissionAction.Create, SubjectName.Tests)) return null;

  return (
    <Dropdown>
      <Button size="sm" variant="outline">
        <LuPlus className="size-4" />
        {t('tests.editor.group.add')}
      </Button>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu aria-label={t('tests.editor.group.add')}>
          {getTypesForSkill(skill).map((type) => (
            <Dropdown.Item
              key={type}
              id={type}
              textValue={t(`tests.questionType.${type}`)}
              onPress={() => onSelect(type)}
            >
              {t(`tests.questionType.${type}`)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

const GroupsCard = ({ test, section, part, onNavigate }: PartPanelProps) => {
  const { t } = useTranslation();
  const isLocked = !!test.lockedAt;
  const { data, isLoading } = useGetQuestionGroups(part.id);
  const { mutate: reorder, isPending: isReordering } =
    useReorderQuestionGroups();
  const groups = byOrder(data ?? []);

  return (
    <Card>
      <Card.Content className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-foreground/50 text-sm font-semibold uppercase">
            {t('tests.editor.group.title')}
          </h3>
          {!isLocked && (
            <AddGroupMenu
              skill={section.skill}
              onSelect={(type) =>
                onNavigate({
                  section: section.id,
                  part: part.id,
                  group: 'new',
                  type,
                })
              }
            />
          )}
        </div>

        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}

        {!isLoading && groups.length === 0 && (
          <div className="text-muted rounded-xl border py-6 text-center text-sm">
            {t('tests.editor.group.empty')}
          </div>
        )}

        {groups.map((group, index) => (
          <GroupRow
            key={group.id}
            group={group}
            index={index}
            count={groups.length}
            isLocked={isLocked}
            isReordering={isReordering}
            onMove={(offset) =>
              reorder({ partId: part.id, ids: moveId(groups, index, offset) })
            }
            onOpen={() =>
              onNavigate({
                section: section.id,
                part: part.id,
                group: String(group.id),
              })
            }
          />
        ))}
      </Card.Content>
    </Card>
  );
};

const PartPanel = (props: PartPanelProps) => (
  <div className="flex flex-col gap-4">
    <PartInfoCard {...props} />
    <GroupsCard {...props} />
  </div>
);

export default PartPanel;
