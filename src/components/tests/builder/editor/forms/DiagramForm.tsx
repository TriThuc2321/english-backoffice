import { Input, Label, TextField } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { DiagramLayout } from '@/types/test';

type DiagramContentShape = {
  imageUrl: string;
  layout: DiagramLayout;
  hint: string;
  x?: number;
  y?: number;
  answer: { value: string };
  explanation?: string;
};

/** Group-level fields (image + layout) — stamped into every question of the group. */
export const DiagramGroupFields = ({
  imageUrl,
  layout,
  onChange,
}: {
  imageUrl: string;
  layout: DiagramLayout;
  onChange: (patch: { imageUrl?: string; layout?: DiagramLayout }) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <TextField
        fullWidth
        value={imageUrl}
        onChange={(value) => onChange({ imageUrl: value })}
      >
        <Label>{t('tests.builder.editor.imageUrl')}</Label>
        <Input placeholder="https://…" />
      </TextField>

      {imageUrl.trim() && (
        <img
          src={imageUrl}
          alt=""
          className="max-h-48 w-full rounded-lg border object-contain"
        />
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-default-700 text-sm font-medium">
          {t('tests.builder.editor.layout')}
        </span>
        <div className="flex gap-1.5">
          {(['listed', 'positioned'] as DiagramLayout[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ layout: value })}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                layout === value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-default-200 text-default-600 hover:border-default-400'
              }`}
            >
              {value === 'listed'
                ? t('tests.builder.editor.layoutListed')
                : t('tests.builder.editor.layoutPositioned')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

type DiagramFormProps = {
  content: DiagramContentShape;
  onChange: (content: DiagramContentShape) => void;
};

/** Per-question (per-label) fields. */
const DiagramForm = ({ content, onChange }: DiagramFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <TextField
        fullWidth
        value={content.hint ?? ''}
        onChange={(hint) => onChange({ ...content, hint })}
      >
        <Label>{t('tests.builder.editor.labelHint')}</Label>
        <Input />
      </TextField>

      <TextField
        fullWidth
        value={content.answer?.value ?? ''}
        onChange={(value) => onChange({ ...content, answer: { value } })}
      >
        <Label>{t('tests.builder.editor.answer')}</Label>
        <Input />
      </TextField>

      {content.layout === 'positioned' && (
        <div className="grid grid-cols-2 gap-3">
          <TextField
            fullWidth
            value={content.x != null ? String(content.x) : ''}
            onChange={(v) =>
              onChange({ ...content, x: v ? Number(v) : undefined })
            }
          >
            <Label>X (%)</Label>
            <Input type="number" min={0} max={100} />
          </TextField>
          <TextField
            fullWidth
            value={content.y != null ? String(content.y) : ''}
            onChange={(v) =>
              onChange({ ...content, y: v ? Number(v) : undefined })
            }
          >
            <Label>Y (%)</Label>
            <Input type="number" min={0} max={100} />
          </TextField>
        </div>
      )}
    </div>
  );
};

export default DiagramForm;
