import { Button, Card, cn, Label, ListBox, Select } from '@heroui/react';
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';

import type {
  QuestionGroupFormData,
  QuestionGroupFormInput,
} from '@/schemas/test';

import {
  getKeyOptions,
  QUESTION_TYPES,
  resolveAnswerKind,
} from '@/constants/questionTypes';

import type { ParagraphOption } from './PassagePreview';

import { NumberInput, TextInput } from '../fields';
import OrderButtons from '../OrderButtons';
import {
  AcceptedAnswer,
  KeyAnswer,
  KeysAnswer,
  SampleAnswer,
} from './AnswerEditors';
import OptionsEditor from './OptionsEditor';

const NO_PARAGRAPH = 'none';

const message = (error: unknown) =>
  (error as { message?: string } | undefined)?.message;

type QuestionCardProps = {
  control: Control<QuestionGroupFormInput, unknown, QuestionGroupFormData>;
  errors: FieldErrors<QuestionGroupFormInput>;
  index: number;
  count: number;
  isLocked: boolean;
  isActive: boolean;
  showMedia: boolean;
  paragraphOptions: ParagraphOption[];
  onActivate: () => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
};

const QuestionCard = ({
  control,
  errors,
  index,
  count,
  isLocked,
  isActive,
  showMedia,
  paragraphOptions,
  onActivate,
  onMove,
  onRemove,
}: QuestionCardProps) => {
  const { t } = useTranslation();
  const [questionType, content, question] = useWatch({
    control,
    name: ['questionType', 'content', `questions.${index}`],
  });
  const spec = QUESTION_TYPES[questionType];
  const answerKind = resolveAnswerKind(spec, content);
  const keyOptions = getKeyOptions(spec, content, question);
  const qErrors = errors.questions?.[index];
  const numberTo = question.numberTo ?? question.numberFrom;
  const isRange = spec.answer === 'keys';
  const path = `questions.${index}` as const;

  return (
    <Card
      onClick={onActivate}
      onFocus={onActivate}
      className={cn(
        'border',
        isActive ? 'border-accent' : 'border-transparent',
      )}
    >
      <Card.Content className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <b>
            {isRange && numberTo !== question.numberFrom
              ? t('tests.editor.group.questionRange', {
                  from: question.numberFrom,
                  to: numberTo,
                })
              : t('tests.editor.group.questionNumber', {
                  n: question.numberFrom,
                })}
          </b>
          {!isLocked && (
            <div className="flex items-center gap-1">
              <OrderButtons index={index} count={count} onMove={onMove} />
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={t('tests.editor.group.removeQuestion')}
                onPress={onRemove}
              >
                <LuX className="text-danger size-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Controller
            name={`${path}.numberFrom`}
            control={control}
            render={({ field }) => (
              <NumberInput
                label={t('tests.editor.group.numberFrom')}
                min={1}
                value={field.value}
                onChange={field.onChange}
                error={qErrors?.numberFrom?.message}
                isDisabled={isLocked}
              />
            )}
          />
          {isRange && (
            <Controller
              name={`${path}.numberTo`}
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.group.numberTo')}
                  min={1}
                  value={field.value}
                  onChange={field.onChange}
                  error={qErrors?.numberTo?.message}
                  isDisabled={isLocked}
                />
              )}
            />
          )}
        </div>

        <Controller
          name={`${path}.prompt`}
          control={control}
          render={({ field }) => (
            <TextInput
              multiline
              rows={2}
              label={t('tests.editor.group.prompt')}
              value={field.value}
              onChange={field.onChange}
              isDisabled={isLocked}
            />
          )}
        />

        {(spec.questionContent === 'options' ||
          spec.questionContent === 'optionsNoText') && (
          <div className="flex flex-col gap-1.5">
            <Label>{t('tests.editor.group.options')}</Label>
            <Controller
              name={`${path}.options`}
              control={control}
              render={({ field }) => (
                <OptionsEditor
                  withText={spec.questionContent === 'options'}
                  value={field.value}
                  onChange={field.onChange}
                  error={message(qErrors?.options)}
                  isDisabled={isLocked}
                />
              )}
            />
          </div>
        )}

        {spec.questionContent === 'timing' && (
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name={`${path}.prepSeconds`}
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.group.prepSeconds')}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
            <Controller
              name={`${path}.responseSeconds`}
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.group.responseSeconds')}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
          </div>
        )}

        {answerKind === 'key' && (
          <Controller
            name={`${path}.key`}
            control={control}
            render={({ field }) => (
              <KeyAnswer
                options={keyOptions}
                value={field.value}
                onChange={field.onChange}
                error={qErrors?.key?.message}
              />
            )}
          />
        )}
        {answerKind === 'keys' && (
          <Controller
            name={`${path}.keys`}
            control={control}
            render={({ field }) => (
              <KeysAnswer
                options={keyOptions}
                count={Math.max(numberTo - question.numberFrom + 1, 1)}
                value={field.value}
                onChange={field.onChange}
                error={message(qErrors?.keys)}
              />
            )}
          />
        )}
        {answerKind === 'accepted' && (
          <Controller
            name={`${path}.accepted`}
            control={control}
            render={({ field }) => (
              <AcceptedAnswer
                value={field.value}
                onChange={field.onChange}
                error={message(qErrors?.accepted)}
              />
            )}
          />
        )}
        {answerKind === 'sample' && (
          <Controller
            name={`${path}.sample`}
            control={control}
            render={({ field: sample }) => (
              <Controller
                name={`${path}.rubric`}
                control={control}
                render={({ field: rubric }) => (
                  <SampleAnswer
                    sample={sample.value}
                    onSampleChange={sample.onChange}
                    rubric={rubric.value}
                    onRubricChange={rubric.onChange}
                    error={qErrors?.sample?.message}
                  />
                )}
              />
            )}
          />
        )}

        <Controller
          name={`${path}.explanation`}
          control={control}
          render={({ field }) => (
            <TextInput
              multiline
              rows={2}
              label={t('tests.editor.group.explanation')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
          {paragraphOptions.length > 0 && (
            <Controller
              name={`${path}.evidenceParagraphId`}
              control={control}
              render={({ field }) => (
                <Select
                  fullWidth
                  selectedKey={
                    field.value != null ? String(field.value) : NO_PARAGRAPH
                  }
                  onSelectionChange={(key) =>
                    field.onChange(
                      key == null || key === NO_PARAGRAPH
                        ? undefined
                        : Number(key),
                    )
                  }
                >
                  <Label>{t('tests.editor.group.evidenceParagraph')}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {[
                        { id: NO_PARAGRAPH, label: '—' },
                        ...paragraphOptions,
                      ].map((option) => (
                        <ListBox.Item
                          key={option.id}
                          id={String(option.id)}
                          textValue={option.label}
                        >
                          {option.label}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              )}
            />
          )}
          <Controller
            name={`${path}.evidenceQuote`}
            control={control}
            render={({ field }) => (
              <TextInput
                className={paragraphOptions.length ? '' : 'sm:col-span-2'}
                label={t('tests.editor.group.evidenceQuote')}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {showMedia && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Controller
              name={`${path}.audioMediaId`}
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.audioMediaId')}
                  min={1}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
            <Controller
              name={`${path}.imageMediaId`}
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.imageMediaId')}
                  min={1}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
            <Controller
              name={`${path}.audioStartMs`}
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('tests.editor.group.answerAudioStart')}
                  value={field.value}
                  onChange={field.onChange}
                  isDisabled={isLocked}
                />
              )}
            />
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default QuestionCard;
