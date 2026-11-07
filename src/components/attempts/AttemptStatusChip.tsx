import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { AttemptStatus } from '@/types/attempt';

const colorMap: Record<
  AttemptStatus,
  'success' | 'warning' | 'default' | 'accent'
> = {
  [AttemptStatus.IN_PROGRESS]: 'accent',
  [AttemptStatus.SUBMITTED]: 'warning',
  [AttemptStatus.GRADED]: 'success',
  [AttemptStatus.EXPIRED]: 'default',
};

const AttemptStatusChip = ({ status }: { status: AttemptStatus }) => {
  const { t } = useTranslation();
  return (
    <Chip size="sm" variant="soft" color={colorMap[status]}>
      <Chip.Label>{t(`attempts.status.${status}`)}</Chip.Label>
    </Chip>
  );
};

export default AttemptStatusChip;
