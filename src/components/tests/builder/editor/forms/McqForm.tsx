import { Button, Input, Label, TextArea, TextField } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuCheck, LuPlus, LuX } from 'react-icons/lu';

import type { McqOption } from '@/types/test';

import {
  MAX_MCQ_OPTIONS,
  MAX_MULTIPLE_ANSWER_OPTIONS,
  MIN_MCQ_OPTIONS,
} from '../../constants';

type McqContent = {
  text: string;
  options: McqOption[];
  answer: { optionId?: string | null; optionIds?: string[] };
  explanation?: string;
};

type McqFormProps = {
  content: McqContent;
  isMultiple: boolean;
  onChange: (content: McqContent) => void;
};

const relabel = (options: McqOption[]) =>
  options.map((option, index) => ({
    ...option,
    label: String.fromCharCode(65 + index),
  }));

const McqForm = ({ content, isMultiple, onChange }: McqFormProps) => {
  const { t } = useTranslation();
  const options = content.options ?? [];
  const maxOptions = isMultiple ? MAX_MULTIPLE_ANSWER_OPTIONS : MAX_MCQ_OPTIONS;

  const isCorrect = (optionId: string) =>
    isMultiple
      ? (content.answer?.optionIds ?? []).includes(optionId)
      : content.answer?.optionId === optionId;

  const toggleCorrect = (optionId: string) => {
    if (isMultiple) {
      const current = content.answer?.optionIds ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      onChange({ ...content, answer: { optionIds: next } });
    } else {
      onChange({ ...content, answer: { optionId } });
    }
  };

  const setOptionText = (optionId: string, text: string) => {
    onChange({
      ...content,
      options: options.map((option) =>
        option.id === optionId ? { ...option, text } : option,
      ),
    });
  };

  const removeOption = (optionId: string) => {
    const nextOptions = relabel(
      options.filter((option) => option.id !== optionId),
    );
    const answer = isMultiple
      ? {
          optionIds: (content.answer?.optionIds ?? []).filter(
            (id) => id !== optionId,
          ),
        }
      : {
          optionId:
            content.answer?.optionId === optionId
              ? null
              : (content.answer?.optionId ?? null),
        };
    onChange({ ...content, options: nextOptions, answer });
  };

  const addOption = () => {
    if (options.length >= maxOptions) return;
    onChange({
      ...content,
      options: relabel([
        ...options,
        { id: crypto.randomUUID(), label: '', text: '' },
      ]),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <TextField
        fullWidth
        value={content.text ?? ''}
        onChange={(text) => onChange({ ...content, text })}
      >
        <Label>{t('tests.builder.editor.questionText')}</Label>
        <TextArea
          rows={2}
          placeholder={t('tests.builder.editor.questionTextPlaceholder')}
        />
      </TextField>

      <div className="flex flex-col gap-2">
        <span className="text-default-700 text-sm font-medium">
          {t('tests.builder.editor.options')}
        </span>

        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleCorrect(option.id)}
              aria-pressed={isCorrect(option.id)}
              className={`flex size-7 shrink-0 items-center justify-center border text-xs font-semibold transition-colors ${
                isMultiple ? 'rounded-md' : 'rounded-full'
              } ${
                isCorrect(option.id)
                  ? 'border-success bg-success text-success-foreground'
                  : 'border-default-300 text-default-500 hover:border-success'
              }`}
            >
              {isCorrect(option.id) ? (
                <LuCheck className="size-3.5" />
              ) : (
                option.label
              )}
            </button>

            <TextField
              fullWidth
              aria-label={`Option ${option.label}`}
              value={option.text}
              onChange={(text) => setOptionText(option.id, text)}
            >
              <Input
                placeholder={t('tests.builder.editor.optionPlaceholder')}
              />
            </TextField>

            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              isDisabled={options.length <= MIN_MCQ_OPTIONS}
              onPress={() => removeOption(option.id)}
              aria-label={t('tests.builder.editor.removeQuestion')}
            >
              <LuX className="size-3.5" />
            </Button>
          </div>
        ))}

        {options.length < maxOptions && (
          <Button
            size="sm"
            variant="ghost"
            onPress={addOption}
            className="self-start"
          >
            <LuPlus className="size-3.5" />
            {t('tests.builder.editor.addOption')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default McqForm;
