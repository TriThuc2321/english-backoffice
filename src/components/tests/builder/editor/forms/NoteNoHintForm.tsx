import {
  Button,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuX } from 'react-icons/lu';

import type { MaxWords } from '@/types/test';

import { MAX_WORDS_OPTIONS } from '../../constants';

type NoteNoHintContentShape = {
  before: string;
  after: string;
  maxWords: MaxWords;
  answer: { acceptedValues: string[] };
  explanation?: string;
};

type NoteNoHintFormProps = {
  content: NoteNoHintContentShape;
  onChange: (content: NoteNoHintContentShape) => void;
};

const NoteNoHintForm = ({ content, onChange }: NoteNoHintFormProps) => {
  const { t } = useTranslation();
  const acceptedValues = content.answer?.acceptedValues ?? [''];

  const setAcceptedValue = (index: number, value: string) => {
    const next = [...acceptedValues];
    next[index] = value;
    onChange({ ...content, answer: { acceptedValues: next } });
  };

  return (
    <div className="flex flex-col gap-3">
      <TextField
        fullWidth
        value={content.before ?? ''}
        onChange={(before) => onChange({ ...content, before })}
      >
        <Label>{t('tests.builder.editor.before')}</Label>
        <TextArea rows={2} />
      </TextField>

      <TextField
        fullWidth
        value={content.after ?? ''}
        onChange={(after) => onChange({ ...content, after })}
      >
        <Label>{t('tests.builder.editor.after')}</Label>
        <TextArea rows={2} />
      </TextField>

      <Select
        fullWidth
        aria-label={t('tests.builder.editor.maxWords')}
        selectedKey={content.maxWords ?? 'ONE_WORD'}
        onSelectionChange={(key) => {
          if (key == null) return;
          onChange({ ...content, maxWords: key as MaxWords });
        }}
      >
        <Label>{t('tests.builder.editor.maxWords')}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {MAX_WORDS_OPTIONS.map((option) => (
              <ListBox.Item
                key={option}
                id={option}
                textValue={t(`tests.builder.maxWords.${option}`)}
              >
                {t(`tests.builder.maxWords.${option}`)}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="flex flex-col gap-2">
        <span className="text-default-700 text-sm font-medium">
          {t('tests.builder.editor.acceptedAnswers')}
        </span>

        {acceptedValues.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <TextField
              fullWidth
              aria-label={`${t('tests.builder.editor.acceptedAnswers')} ${index + 1}`}
              value={value}
              onChange={(v) => setAcceptedValue(index, v)}
            >
              <Input
                placeholder={t(
                  'tests.builder.editor.acceptedAnswerPlaceholder',
                )}
              />
            </TextField>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              isDisabled={acceptedValues.length <= 1}
              onPress={() =>
                onChange({
                  ...content,
                  answer: {
                    acceptedValues: acceptedValues.filter(
                      (_, i) => i !== index,
                    ),
                  },
                })
              }
              aria-label={t('tests.builder.editor.removeQuestion')}
            >
              <LuX className="size-3.5" />
            </Button>
          </div>
        ))}

        <Button
          size="sm"
          variant="ghost"
          className="self-start"
          onPress={() =>
            onChange({
              ...content,
              answer: { acceptedValues: [...acceptedValues, ''] },
            })
          }
        >
          <LuPlus className="size-3.5" />
          {t('tests.builder.editor.addAcceptedAnswer')}
        </Button>
      </div>
    </div>
  );
};

export default NoteNoHintForm;
