import { Card, cn, Skeleton } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { Paragraph } from '@/types/passage';

import { useGetPassageById } from '@/hooks/apis/passages';
import { MarkedBy } from '@/types/common';

import { letterAt } from '../groupForm';

export const paragraphLabel = (
  markedBy: MarkedBy | undefined,
  index: number,
) => {
  if (markedBy === MarkedBy.ALPHABET) return letterAt(index);
  if (markedBy === MarkedBy.NUMBER) return String(index + 1);
  return `¶${index + 1}`;
};

export type ParagraphOption = { id: number; label: string };

export const usePassageParagraphs = (passageId?: number) => {
  const { data, isLoading } = useGetPassageById(
    passageId ? String(passageId) : '',
  );
  const paragraphs: Paragraph[] = data?.paragraphs ?? [];
  const options: ParagraphOption[] = paragraphs
    .filter((p) => p.id)
    .map((p, index) => ({
      id: Number(p.id),
      label: paragraphLabel(data?.markedBy, index),
    }));
  return { passage: data, paragraphs, options, isLoading };
};

type PassagePreviewProps = {
  passageId: number;
  selectedParagraphId?: number;
  onParagraphPress?: (paragraphId: number) => void;
};

const PassagePreview = ({
  passageId,
  selectedParagraphId,
  onParagraphPress,
}: PassagePreviewProps) => {
  const { t } = useTranslation();
  const { passage, paragraphs, isLoading } = usePassageParagraphs(passageId);

  return (
    <Card>
      <Card.Content className="flex flex-col gap-3">
        <h3 className="text-foreground/50 text-sm font-semibold uppercase">
          {t('tests.editor.group.passagePreview')}
        </h3>
        {isLoading && <Skeleton className="rounded-field h-40" />}
        {passage && (
          <>
            <div>
              <h4 className="font-semibold">{passage.title}</h4>
              {passage.subtitle && (
                <p className="text-muted text-sm">{passage.subtitle}</p>
              )}
            </div>
            <p className="text-muted text-xs">
              {t('tests.editor.group.evidenceHint')}
            </p>
            {paragraphs.map((paragraph, index) => {
              const id = Number(paragraph.id);
              return (
                <button
                  key={paragraph.id}
                  type="button"
                  onClick={() => onParagraphPress?.(id)}
                  className={cn(
                    'hover:bg-default rounded-field flex gap-2 p-2 text-left text-sm',
                    selectedParagraphId === id && 'bg-accent-soft',
                  )}
                >
                  <b className="shrink-0">
                    {paragraphLabel(passage.markedBy, index)}
                  </b>
                  <span className="whitespace-pre-line">
                    {paragraph.content}
                  </span>
                </button>
              );
            })}
          </>
        )}
      </Card.Content>
    </Card>
  );
};

export default PassagePreview;
