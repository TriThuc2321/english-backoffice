import {
  Button,
  Card,
  Checkbox,
  Description,
  Label,
  ListBox,
  Select,
  Skeleton,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

import type {
  QuestionGroupFormData,
  QuestionGroupFormInput,
} from '@/schemas/test';
import type {
  QuestionGroup,
  QuestionType,
  Test,
  TestPart,
  TestSection,
} from '@/types/test';

import MyButton from '@/components/shared/Button';
import Section from '@/components/shared/Section';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import {
  getTypesForSkill,
  QUESTION_TYPES,
  usesWordLimit,
} from '@/constants/questionTypes';
import {
  useCreateQuestionGroup,
  useDeleteQuestionGroup,
  useGetQuestionGroupById,
  useGetQuestionGroups,
  useGetQuestionGroupsDetail,
  useSaveQuestionGroup,
} from '@/hooks/apis/question-groups';
import { useCreateEditQuestionGroupForm } from '@/hooks/forms';
import { PermissionAction, SubjectName } from '@/types/auth';
import { SkillType } from '@/types/test';

import type { EditorLocation } from '../TestEditor';

import { NumberInput, TextInput } from '../fields';
import {
  defaultContent,
  defaultQuestion,
  groupToForm,
  newGroupForm,
  resetQuestionForType,
  toCreateGroupPayload,
  toSaveGroupPayload,
} from '../groupForm';
import GridEditor from './GridEditor';
import OptionsEditor from './OptionsEditor';
import PassagePicker from './PassagePicker';
import PassagePreview, {
  usePassageParagraphs,
  type ParagraphOption,
} from './PassagePreview';
import QuestionCard from './QuestionCard';
import TemplateEditor from './TemplateEditor';

type FormControl = Control<
  QuestionGroupFormInput,
  unknown,
  QuestionGroupFormData
>;

const message = (error: unknown) =>
  (error as { message?: string } | undefined)?.message;

type GroupContentEditorProps = {
  control: FormControl;
  errors: FieldErrors<QuestionGroupFormInput>;
  questionType: QuestionType;
  paragraphOptions: ParagraphOption[];
  isDisabled: boolean;
};

const GroupContentEditor = ({
  control,
  errors,
  questionType,
  paragraphOptions,
  isDisabled,
}: GroupContentEditorProps) => {
  const { t } = useTranslation();
  const kind = QUESTION_TYPES[questionType].groupContent;
  const contentErrors = errors.content;

  if (kind === 'none') return null;

  const optionsField = (withText: boolean, label: string) => (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Controller
        name="content.options"
        control={control}
        render={({ field }) => (
          <>
            <OptionsEditor
              withText={withText}
              keyStyle={
                questionType === 'MATCHING_HEADINGS' ? 'roman' : 'letter'
              }
              value={field.value}
              onChange={field.onChange}
              error={message(contentErrors?.options)}
              isDisabled={isDisabled}
            />
            {kind === 'matchingInfo' &&
              paragraphOptions.length > 0 &&
              !isDisabled && (
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onPress={() =>
                      field.onChange(
                        paragraphOptions.map((p) => ({
                          key: p.label,
                          text: '',
                        })),
                      )
                    }
                  >
                    {t('tests.editor.group.useParagraphLetters')}
                  </Button>
                </div>
              )}
          </>
        )}
      />
    </div>
  );

  const allowReuseField = (
    <Controller
      name="content.allowReuse"
      control={control}
      render={({ field }) => (
        <Checkbox
          isSelected={!!field.value}
          onChange={field.onChange}
          isDisabled={isDisabled}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>{t('tests.editor.group.allowReuse')}</Label>
          </Checkbox.Content>
        </Checkbox>
      )}
    />
  );

  const templateField = (
    <Controller
      name="content.template"
      control={control}
      render={({ field }) => (
        <TemplateEditor
          value={field.value}
          onChange={field.onChange}
          error={contentErrors?.template?.message}
          isDisabled={isDisabled}
        />
      )}
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold">
        {t('tests.editor.group.groupContent')}
      </h4>
      {(kind === 'matching' || kind === 'matchingInfo') && (
        <>
          {optionsField(
            kind === 'matching',
            t('tests.editor.group.matchingOptions'),
          )}
          {allowReuseField}
        </>
      )}
      {kind === 'labels' && optionsField(false, t('tests.editor.group.labels'))}
      {(kind === 'template' || kind === 'templateOptional') && templateField}
      {kind === 'summary' && (
        <>
          {templateField}
          {optionsField(true, t('tests.editor.group.wordBank'))}
        </>
      )}
      {kind === 'table' && (
        <Controller
          name="content.headers"
          control={control}
          render={({ field: headers }) => (
            <Controller
              name="content.rows"
              control={control}
              render={({ field: rows }) => (
                <GridEditor
                  headers={headers.value}
                  onHeadersChange={headers.onChange}
                  rows={rows.value}
                  onRowsChange={rows.onChange}
                  error={message(contentErrors?.rows)}
                  isDisabled={isDisabled}
                />
              )}
            />
          )}
        />
      )}
      {kind === 'info' && (
        <>
          <Controller
            name="content.infoTitle"
            control={control}
            render={({ field }) => (
              <TextInput
                label={t('tests.editor.group.infoTitle')}
                value={field.value}
                onChange={field.onChange}
                isDisabled={isDisabled}
              />
            )}
          />
          <Controller
            name="content.rows"
            control={control}
            render={({ field }) => (
              <GridEditor
                rows={field.value}
                onRowsChange={field.onChange}
                error={message(contentErrors?.rows)}
                isDisabled={isDisabled}
              />
            )}
          />
        </>
      )}
    </div>
  );
};

type GroupEditorProps = {
  test: Test;
  section: TestSection;
  part: TestPart;
  group?: QuestionGroup;
  initialValues: QuestionGroupFormData;
  onNavigate: (location: EditorLocation) => void;
};

const GroupEditor = ({
  test,
  section,
  part,
  group,
  initialValues,
  onNavigate,
}: GroupEditorProps) => {
  const { t } = useTranslation();
  const isLocked = !!test.lockedAt;
  const isReading = section.skill === SkillType.READING;
  const [activeIndex, setActiveIndex] = useState(0);

  const { mutateAsync: createGroup, isPending: isCreating } =
    useCreateQuestionGroup();
  const { mutateAsync: saveGroup, isPending: isSaving } =
    useSaveQuestionGroup();
  const { mutateAsync: deleteGroup, isPending: isDeleting } =
    useDeleteQuestionGroup();

  const form = useCreateEditQuestionGroupForm({ defaultValues: initialValues });
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const [questionType, passages] = useWatch({
    control,
    name: ['questionType', 'passages'],
  });
  const spec = QUESTION_TYPES[questionType];

  // Fixed hook count: up to 3 linked passages
  const p0 = usePassageParagraphs(passages[0]?.id);
  const p1 = usePassageParagraphs(passages[1]?.id);
  const p2 = usePassageParagraphs(passages[2]?.id);
  const paragraphOptions = [p0, p1, p2]
    .slice(0, passages.length)
    .flatMap((p) => p.options);

  const typeOptions = getTypesForSkill(section.skill);

  const onTypeChange = (type: QuestionType) => {
    if (type === questionType) return;
    setValue('questionType', type, { shouldDirty: true });
    setValue('content', defaultContent(type), { shouldDirty: true });
    // Old answers don't fit the new type: recreate every question
    setValue(
      'questions',
      getValues('questions').map((q) =>
        resetQuestionForType({ ...q, id: undefined }, type),
      ),
      { shouldDirty: true },
    );
  };

  const addQuestion = () => {
    const questions = getValues('questions');
    const last = questions[questions.length - 1];
    const next = last ? (last.numberTo ?? last.numberFrom) + 1 : 1;
    append(defaultQuestion(questionType, next));
    setActiveIndex(questions.length);
  };

  const onParagraphPress = (paragraphId: number) =>
    setValue(`questions.${activeIndex}.evidenceParagraphId`, paragraphId, {
      shouldDirty: true,
    });

  const onSubmit = async (data: QuestionGroupFormData) => {
    try {
      if (!group) {
        const created = await createGroup(toCreateGroupPayload(part.id, data));
        if (created?.id)
          onNavigate({
            section: section.id,
            part: part.id,
            group: String(created.id),
          });
        return;
      }
      await saveGroup(toSaveGroupPayload(group, data, isLocked));
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    if (!group) return;
    try {
      await deleteGroup([group.id]);
      onNavigate({ section: section.id, part: part.id });
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => onNavigate({ section: section.id, part: part.id });

  const questionsError =
    errors.questions?.root?.message ?? message(errors.questions);

  const questionsCard = (
    <Card>
      <Card.Content className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-foreground/50 text-sm font-semibold uppercase">
            {t('tests.editor.group.questions')}
          </h3>
          {!isLocked && (
            <Button size="sm" variant="outline" onPress={addQuestion}>
              <LuPlus className="size-4" />
              {t('tests.editor.group.addQuestion')}
            </Button>
          )}
        </div>
        {questionsError && (
          <p className="text-danger text-sm">{questionsError}</p>
        )}
        {fields.map((field, index) => (
          <QuestionCard
            key={field.id}
            control={control}
            errors={errors}
            index={index}
            count={fields.length}
            isLocked={isLocked}
            isActive={index === activeIndex}
            showMedia={
              section.skill === SkillType.LISTENING ||
              spec.questionContent === 'timing'
            }
            paragraphOptions={paragraphOptions}
            onActivate={() => setActiveIndex(index)}
            onMove={(offset) => {
              move(index, index + offset);
              setActiveIndex(index + offset);
            }}
            onRemove={() => {
              remove(index);
              setActiveIndex(0);
            }}
          />
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <Card>
        <Card.Content className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-foreground/50 text-sm font-semibold uppercase">
              {group
                ? t('tests.editor.group.editTitle')
                : t('tests.editor.group.createTitle')}
            </h3>
            {group && !isLocked && (
              <ConfirmWrapper
                isDisabled={isDeleting}
                title={t('tests.editor.group.delete')}
                description={t('tests.editor.group.deleteConfirm')}
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
                  {t('tests.editor.group.delete')}
                </MyButton>
              </ConfirmWrapper>
            )}
          </div>

          <Section>
            <Select
              fullWidth
              selectedKey={questionType}
              onSelectionChange={(key) =>
                key != null && onTypeChange(key as QuestionType)
              }
              isDisabled={isLocked}
            >
              <Label>{t('tests.editor.group.questionType')}</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {typeOptions.map((type) => (
                    <ListBox.Item
                      key={type}
                      id={type}
                      textValue={t(`tests.questionType.${type}`)}
                    >
                      {t(`tests.questionType.${type}`)}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              {group && (
                <Description>
                  {t('tests.editor.group.typeChangeHint')}
                </Description>
              )}
            </Select>

            {usesWordLimit(spec) ? (
              <Controller
                name="wordLimit"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label={t('tests.editor.group.wordLimit')}
                    min={1}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.wordLimit?.message}
                    isDisabled={isLocked}
                  />
                )}
              />
            ) : (
              <span className="hidden sm:block" />
            )}

            <Controller
              name="instruction"
              control={control}
              render={({ field }) => (
                <TextInput
                  multiline
                  rows={2}
                  className="sm:col-span-2"
                  label={t('tests.editor.group.instruction')}
                  placeholder={t('tests.editor.group.instructionPlaceholder')}
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
                <NumberInput
                  label={t('tests.editor.audioMediaId')}
                  description={t('tests.editor.mediaHint')}
                  min={1}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
            <Controller
              name="imageMediaId"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.imageMediaId')}
                  description={t('tests.editor.mediaHint')}
                  min={1}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />

            {isReading && (
              <Controller
                name="passages"
                control={control}
                render={({ field }) => (
                  <div className="sm:col-span-2">
                    <PassagePicker
                      value={field.value}
                      onChange={field.onChange}
                      isDisabled={isLocked}
                    />
                  </div>
                )}
              />
            )}
          </Section>

          <GroupContentEditor
            control={control}
            errors={errors}
            questionType={questionType}
            paragraphOptions={paragraphOptions}
            isDisabled={isLocked}
          />
        </Card.Content>
      </Card>

      {isReading && passages.length > 0 ? (
        <div className="grid items-start gap-4 xl:grid-cols-2">
          <div className="flex flex-col gap-4 xl:sticky xl:top-4">
            {passages.map((passage) => (
              <PassagePreview
                key={passage.id}
                passageId={passage.id}
                onParagraphPress={onParagraphPress}
              />
            ))}
          </div>
          {questionsCard}
        </div>
      ) : (
        questionsCard
      )}

      <Card>
        <Card.Content className="flex flex-row items-center justify-end gap-2">
          <Button type="button" variant="outline" onPress={goBack}>
            {t('common.cancel')}
          </Button>
          <MyButton
            I={group ? PermissionAction.Update : PermissionAction.Create}
            a={SubjectName.Tests}
            type="submit"
            variant="primary"
            isPending={isCreating || isSaving}
            isDisabled={!!group && !isDirty}
          >
            {t('tests.editor.group.save')}
          </MyButton>
        </Card.Content>
      </Card>
    </form>
  );
};

type GroupPanelProps = {
  test: Test;
  section: TestSection;
  part: TestPart;
  groupId: number | 'new';
  newType?: QuestionType;
  onNavigate: (location: EditorLocation) => void;
};

const GroupPanel = ({
  test,
  section,
  part,
  groupId,
  newType,
  onNavigate,
}: GroupPanelProps) => {
  const { t } = useTranslation();
  const isNew = groupId === 'new';
  const { data: group, isLoading } = useGetQuestionGroupById(
    isNew ? undefined : groupId,
  );

  // Default first number: right after the last question of this part
  const { data: partGroups = [], isLoading: isLoadingGroups } =
    useGetQuestionGroups(isNew ? part.id : undefined);
  const details = useGetQuestionGroupsDetail(partGroups.map((g) => g.id));
  const isLoadingNumbers =
    isNew && (isLoadingGroups || details.some((d) => d.isLoading));
  const lastNumber = Math.max(
    0,
    ...details.flatMap((d) => d.data?.questions?.map((q) => q.numberTo) ?? []),
  );

  const type =
    newType && QUESTION_TYPES[newType]?.skills.includes(section.skill)
      ? newType
      : getTypesForSkill(section.skill)[0];

  const initialValues = useMemo(() => {
    if (group) return groupToForm(group);
    if (isNew && type) return newGroupForm(type, lastNumber + 1);
    return undefined;
  }, [group, isNew, type, lastNumber]);

  if ((!isNew && isLoading) || isLoadingNumbers)
    return <Skeleton className="h-96 rounded-xl" />;

  if (!initialValues || (group && group.partId !== part.id))
    return (
      <div className="text-muted rounded-xl border py-8 text-center text-sm">
        {t('tests.editor.group.notFound')}
      </div>
    );

  return (
    <GroupEditor
      test={test}
      section={section}
      part={part}
      group={group}
      initialValues={initialValues}
      onNavigate={onNavigate}
    />
  );
};

export default GroupPanel;
