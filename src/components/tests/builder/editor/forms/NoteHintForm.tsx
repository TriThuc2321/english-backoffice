import { Label, ListBox, Select, TextArea, TextField } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { MaxWords } from '@/types/test';

import { MAX_WORDS_OPTIONS } from '../../constants';

type NoteHintContentShape = {
  before: string;
  after: string;
  maxWords: MaxWords;
  wordBank: string[];
  answer: { value: string | null };
  explanation?: string;
};

type NoteHintFormProps = {
  content: NoteHintContentShape;
  wordBank: string[];
  onChange: (content: NoteHintContentShape) => void;
};

const NoteHintForm = ({ content, wordBank, onChange }: NoteHintFormProps) => {
  const { t } = useTranslation();

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

      <div className="grid grid-cols-2 gap-3">
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

        <Select
          fullWidth
          aria-label={t('tests.builder.editor.correctWord')}
          placeholder={t('tests.builder.editor.selectWord')}
          isDisabled={wordBank.length === 0}
          selectedKey={content.answer?.value ?? null}
          onSelectionChange={(key) => {
            if (key == null) return;
            onChange({ ...content, answer: { value: String(key) } });
          }}
        >
          <Label>{t('tests.builder.editor.correctWord')}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {wordBank.map((word) => (
                <ListBox.Item key={word} id={word} textValue={word}>
                  {word}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {(content.before || content.after || content.answer?.value) && (
        <div className="bg-default-50 rounded-lg border p-3">
          <span className="text-default-400 font-mono text-[10px] tracking-wide uppercase">
            {t('tests.builder.editor.gapPreview')}
          </span>
          <p className="text-default-700 mt-1 text-sm">
            {content.before}{' '}
            <span className="bg-accent/10 text-accent rounded px-1.5 py-0.5 font-medium">
              {content.answer?.value ?? '_____'}
            </span>{' '}
            {content.after}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteHintForm;
