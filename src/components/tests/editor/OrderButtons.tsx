import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

type OrderButtonsProps = {
  index: number;
  count: number;
  onMove: (offset: -1 | 1) => void;
  isDisabled?: boolean;
};

const OrderButtons = ({
  index,
  count,
  onMove,
  isDisabled,
}: OrderButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        className="h-5 min-h-0"
        aria-label={t('tests.editor.moveUp')}
        isDisabled={isDisabled || index === 0}
        onPress={() => onMove(-1)}
      >
        <LuChevronUp className="size-3.5" />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        className="h-5 min-h-0"
        aria-label={t('tests.editor.moveDown')}
        isDisabled={isDisabled || index === count - 1}
        onPress={() => onMove(1)}
      >
        <LuChevronDown className="size-3.5" />
      </Button>
    </div>
  );
};

export default OrderButtons;
