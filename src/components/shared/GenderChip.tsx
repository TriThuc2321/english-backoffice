import { Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { Gender } from '@/types/common';

type GenderChipProps = {
  gender: Gender;
};

const chipColorMap: Record<Gender, 'accent' | 'warning' | 'default'> = {
  FEMALE: 'accent',
  MALE: 'warning',
  OTHER: 'default',
};

const GenderChip = ({ gender }: GenderChipProps) => {
  const { t } = useTranslation();

  const map: Record<Gender, string> = {
    [Gender.MALE]: t('cmsUsers.form.genderMale'),
    [Gender.FEMALE]: t('cmsUsers.form.genderFemale'),
    [Gender.OTHER]: t('cmsUsers.form.genderOther'),
  };
  return (
    <Chip
      className="w-fit"
      color={chipColorMap[gender]}
      size="sm"
      variant="soft"
    >
      <Chip.Label>{map[gender]}</Chip.Label>
    </Chip>
  );
};

export default GenderChip;
