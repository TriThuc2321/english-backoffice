import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { MarkedBy } from '@/types/common';

type MarkedByChipProps = {
  markedBy: MarkedBy;
};

const chipColorMap: Record<MarkedBy, 'accent' | 'warning' | 'default'> = {
  [MarkedBy.ALPHABET]: 'accent',
  [MarkedBy.NUMBER]: 'warning',
  [MarkedBy.NONE]: 'default',
};

const MarkedByChip = ({ markedBy }: MarkedByChipProps) => {
  const { t } = useTranslation();

  const map: Record<MarkedBy, string> = {
    [MarkedBy.ALPHABET]: t('passages.form.markedBy.alphabet'),
    [MarkedBy.NUMBER]: t('passages.form.markedBy.number'),
    [MarkedBy.NONE]: t('passages.form.markedBy.none'),
  };

  return (
    <Chip
      className="w-fit"
      color={chipColorMap[markedBy]}
      size="sm"
      variant="soft"
    >
      <Chip.Label>{map[markedBy]}</Chip.Label>
    </Chip>
  );
};

export default MarkedByChip;
