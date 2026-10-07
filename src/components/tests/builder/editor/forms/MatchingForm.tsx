import { Label, ListBox, Select, TextArea, TextField } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type MatchingContentShape = {
  statement: string;
  answer: { paragraphLabel: string | null };
  explanation?: string;
};

type MatchingFormProps = {
  content: MatchingContentShape;
  labels: string[];
  onChange: (content: MatchingContentShape) => void;
};

const MatchingForm = ({ content, labels, onChange }: MatchingFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <TextField
        fullWidth
        value={content.statement ?? ''}
        onChange={(statement) => onChange({ ...content, statement })}
      >
        <Label>{t('tests.builder.editor.statement')}</Label>
        <TextArea
          rows={2}
          placeholder={t('tests.builder.editor.statementPlaceholder')}
        />
      </TextField>

      <Select
        fullWidth
        aria-label={t('tests.builder.editor.paragraphLabel')}
        placeholder={t('tests.builder.editor.selectParagraph')}
        isDisabled={labels.length === 0}
        selectedKey={content.answer?.paragraphLabel ?? null}
        onSelectionChange={(key) => {
          if (key == null) return;
          onChange({ ...content, answer: { paragraphLabel: String(key) } });
        }}
      >
        <Label>{t('tests.builder.editor.paragraphLabel')}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {labels.map((label) => (
              <ListBox.Item key={label} id={label} textValue={label}>
                {label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
};

export default MatchingForm;
