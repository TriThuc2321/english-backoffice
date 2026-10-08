import { useTranslation } from 'react-i18next';
import { LuCheck, LuX } from 'react-icons/lu';

type BooleanIconProps = {
  value?: boolean;
};

const BooleanIcon = ({ value }: BooleanIconProps) => {
  const { t } = useTranslation();
  const label = value ? t('common.yes') : t('common.no');
  const Icon = value ? LuCheck : LuX;

  return (
    <span
      aria-label={label}
      className={`inline-flex size-5 items-center justify-center rounded-full border ${
        value ? 'border-success text-success' : 'border-danger text-danger'
      }`}
      role="img"
    >
      <Icon className="size-3" />
    </span>
  );
};

export default BooleanIcon;
