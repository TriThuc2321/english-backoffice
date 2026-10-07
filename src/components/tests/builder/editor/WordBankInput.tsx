import { Chip, Input, Label, TextField } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';

type WordBankInputProps = {
  words: string[];
  onChange: (words: string[]) => void;
  isInvalid?: boolean;
};

const WordBankInput = ({ words, onChange, isInvalid }: WordBankInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const addWord = () => {
    const word = value.trim();
    if (!word) return;
    if (!words.includes(word)) onChange([...words, word]);
    setValue('');
  };

  return (
    <TextField
      fullWidth
      value={value}
      onChange={setValue}
      isInvalid={isInvalid}
    >
      <Label>{t('tests.builder.editor.wordBank')}</Label>
      {words.length > 0 && (
        <div className="flex flex-wrap gap-1.5 py-1.5">
          {words.map((word) => (
            <Chip key={word} size="sm" variant="soft" color="accent">
              <Chip.Label>{word}</Chip.Label>
              <button
                type="button"
                aria-label={`Remove ${word}`}
                onClick={() => onChange(words.filter((w) => w !== word))}
                className="hover:text-danger ml-0.5"
              >
                <LuX className="size-3" />
              </button>
            </Chip>
          ))}
        </div>
      )}
      <Input
        placeholder={t('tests.builder.editor.wordBankPlaceholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addWord();
          } else if (e.key === 'Backspace' && !value && words.length > 0) {
            onChange(words.slice(0, -1));
          }
        }}
      />
      {isInvalid && (
        <p className="text-danger text-xs">
          {t('tests.builder.editor.wordBankRequired')}
        </p>
      )}
    </TextField>
  );
};

export default WordBankInput;
