import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPlus, LuX } from 'react-icons/lu';

import type { OptionFormData } from '@/schemas/test';

import { ErrorText, TextInput } from '../fields';
import { nextOptionKey } from '../groupForm';

type OptionsEditorProps = {
  value: OptionFormData[];
  onChange: (value: OptionFormData[]) => void;
  withText?: boolean;
  keyStyle?: 'letter' | 'roman';
  error?: string;
  isDisabled?: boolean;
};

// key + text rows; without text it is a compact list of keys (labels, TOEIC P1/2)
const OptionsEditor = ({
  value,
  onChange,
  withText = true,
  keyStyle = 'letter',
  error,
  isDisabled,
}: OptionsEditorProps) => {
  const { t } = useTranslation();

  const update = (index: number, patch: Partial<OptionFormData>) =>
    onChange(value.map((o, i) => (i === index ? { ...o, ...patch } : o)));

  const remove = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  const add = () =>
    onChange([...value, { key: nextOptionKey(value, keyStyle), text: '' }]);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={withText ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}
      >
        {value.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <TextInput
              className={withText ? 'w-16 shrink-0' : 'w-14'}
              placeholder={t('tests.editor.group.key')}
              value={option.key}
              onChange={(key) => update(index, { key })}
              isDisabled={isDisabled}
            />
            {withText && (
              <TextInput
                placeholder={t('tests.editor.group.optionText')}
                value={option.text}
                onChange={(text) => update(index, { text })}
                isDisabled={isDisabled}
              />
            )}
            {!isDisabled && (
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={t('tests.editor.group.removeOption')}
                onPress={() => remove(index)}
              >
                <LuX className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <ErrorText>{error}</ErrorText>
      {!isDisabled && (
        <div>
          <Button size="sm" variant="ghost" onPress={add}>
            <LuPlus className="size-4" />
            {t('tests.editor.group.addOption')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OptionsEditor;
