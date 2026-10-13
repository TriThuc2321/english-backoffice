import { Button, Label } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuX } from 'react-icons/lu';

import { ErrorText, TextInput } from '../fields';

type KeyChipsProps = {
  options: string[];
  isSelected: (key: string) => boolean;
  onToggle: (key: string) => void;
  isDisabled?: boolean;
};

const KeyChips = ({
  options,
  isSelected,
  onToggle,
  isDisabled,
}: KeyChipsProps) => {
  const { t } = useTranslation();

  if (!options.length)
    return (
      <p className="text-muted text-sm">
        {t('tests.editor.group.noKeyOptions')}
      </p>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((key) => (
        <Button
          key={key}
          size="sm"
          variant={isSelected(key) ? 'primary' : 'outline'}
          isDisabled={isDisabled}
          onPress={() => onToggle(key)}
        >
          {key}
        </Button>
      ))}
    </div>
  );
};

type KeyAnswerProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isDisabled?: boolean;
};

export const KeyAnswer = ({
  options,
  value,
  onChange,
  error,
  isDisabled,
}: KeyAnswerProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{t('tests.editor.group.answer')}</Label>
      <KeyChips
        options={options}
        isSelected={(key) => key === value}
        onToggle={(key) => onChange(key === value ? '' : key)}
        isDisabled={isDisabled}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
};

type KeysAnswerProps = {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  count: number;
  error?: string;
  isDisabled?: boolean;
};

export const KeysAnswer = ({
  options,
  value,
  onChange,
  count,
  error,
  isDisabled,
}: KeysAnswerProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{t('tests.editor.group.answerKeys', { count })}</Label>
      <KeyChips
        options={options}
        isSelected={(key) => value.includes(key)}
        onToggle={(key) =>
          onChange(
            value.includes(key)
              ? value.filter((k) => k !== key)
              : [...value, key],
          )
        }
        isDisabled={isDisabled}
      />
      <ErrorText>{error}</ErrorText>
    </div>
  );
};

type AcceptedAnswerProps = {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  isDisabled?: boolean;
};

export const AcceptedAnswer = ({
  value,
  onChange,
  error,
  isDisabled,
}: AcceptedAnswerProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{t('tests.editor.group.acceptedAnswers')}</Label>
      <div className="flex flex-wrap gap-2">
        {value.map((answer, index) => (
          <div key={index} className="flex items-center gap-1">
            <TextInput
              className="w-44"
              placeholder={t('tests.editor.group.acceptedPlaceholder')}
              value={answer}
              onChange={(v) =>
                onChange(value.map((a, i) => (i === index ? v : a)))
              }
              isDisabled={isDisabled}
            />
            {value.length > 1 && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={t('tests.editor.group.remove')}
                isDisabled={isDisabled}
                onPress={() => onChange(value.filter((_, i) => i !== index))}
              >
                <LuX className="size-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label={t('tests.editor.group.addAccepted')}
          isDisabled={isDisabled}
          onPress={() => onChange([...value, ''])}
        >
          <LuPlus className="size-4" />
        </Button>
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
};

type RubricItem = { name: string; value: string };

type SampleAnswerProps = {
  sample: string;
  onSampleChange: (value: string) => void;
  rubric: RubricItem[];
  onRubricChange: (value: RubricItem[]) => void;
  error?: string;
  isDisabled?: boolean;
};

export const SampleAnswer = ({
  sample,
  onSampleChange,
  rubric,
  onRubricChange,
  error,
  isDisabled,
}: SampleAnswerProps) => {
  const { t } = useTranslation();
  const update = (index: number, patch: Partial<RubricItem>) =>
    onRubricChange(
      rubric.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );

  return (
    <div className="flex flex-col gap-2">
      <TextInput
        multiline
        rows={5}
        label={t('tests.editor.group.sample')}
        value={sample}
        onChange={onSampleChange}
        error={error}
        isDisabled={isDisabled}
      />
      <Label>{t('tests.editor.group.rubric')}</Label>
      {rubric.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <TextInput
            className="w-32 shrink-0"
            placeholder={t('tests.editor.group.rubricName')}
            value={item.name}
            onChange={(name) => update(index, { name })}
            isDisabled={isDisabled}
          />
          <TextInput
            placeholder={t('tests.editor.group.rubricValue')}
            value={item.value}
            onChange={(value) => update(index, { value })}
            isDisabled={isDisabled}
          />
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={t('tests.editor.group.remove')}
            isDisabled={isDisabled}
            onPress={() => onRubricChange(rubric.filter((_, i) => i !== index))}
          >
            <LuX className="size-4" />
          </Button>
        </div>
      ))}
      {!isDisabled && (
        <div>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => onRubricChange([...rubric, { name: '', value: '' }])}
          >
            <LuPlus className="size-4" />
            {t('tests.editor.group.addRubric')}
          </Button>
        </div>
      )}
    </div>
  );
};
