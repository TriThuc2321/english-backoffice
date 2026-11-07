import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { GradingStatus } from '@/types/grading';

import { gradingStatusColorMap } from './constants';

const GradingStatusChip = ({ status }: { status: GradingStatus }) => {
  const { t } = useTranslation();
  return (
    <Chip size="sm" variant="soft" color={gradingStatusColorMap[status]}>
      <Chip.Label>{t(`grading.status.${status}`)}</Chip.Label>
    </Chip>
  );
};

export default GradingStatusChip;
