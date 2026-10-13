import { useTranslation } from 'react-i18next';

import { extractPlaceholders } from '@/constants/questionTypes';

import { TextInput } from '../fields';

type TemplateEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isDisabled?: boolean;
};

const TemplateEditor = ({
  value,
  onChange,
  error,
  isDisabled,
}: TemplateEditorProps) => {
  const { t } = useTranslation();
  const placeholders = extractPlaceholders(value);

  return (
    <div className="flex flex-col gap-1">
      <TextInput
        multiline
        rows={6}
        label={t('tests.editor.group.template')}
        placeholder={'Name: Sarah {{1}}\nPostcode: {{2}}'}
        description={
          placeholders.length
            ? t('tests.editor.group.placeholdersFound', {
                list: placeholders.join(', '),
              })
            : t('tests.editor.group.templateHint', { example: '{{n}}' })
        }
        value={value}
        onChange={onChange}
        error={error}
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default TemplateEditor;
