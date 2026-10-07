import { Label, TextArea, TextField } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type TfnContentShape = {
  statement: string;
  answer: { value: string | null };
  explanation?: string;
};

type TfnFormProps = {
  content: TfnContentShape;
  values: string[];
  onChange: (content: TfnContentShape) => void;
};

const TfnForm = ({ content, values, onChange }: TfnFormProps) => {
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

      <div className="flex flex-col gap-1.5">
        <span className="text-default-700 text-sm font-medium">
          {t('tests.builder.editor.answer')}
        </span>
        <div className="flex gap-1.5">
          {values.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...content, answer: { value } })}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                content.answer?.value === value
                  ? 'border-success bg-success/10 text-success'
                  : 'border-default-200 text-default-600 hover:border-default-400'
              }`}
            >
              {value.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TfnForm;
