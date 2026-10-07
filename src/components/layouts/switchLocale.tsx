import { Button, Dropdown, Label, cn } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import type { Locale } from '@/i18n';

import { FlagUSIcon, FlagVNIcon } from '@/assets/icons';
import { LOCALE } from '@/constants/locale';
import { useLocale } from '@/providers/locale.provider';

export default function SwitchLocale() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  const iconClasses =
    'text-xs size-5 text-default-500 pointer-events-none shrink-0';

  const onSwitchLocale = (next: Locale) => {
    setLocale(next);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button variant="tertiary" isIconOnly className="rounded-full">
          {locale === LOCALE.VI ? (
            <FlagVNIcon className={iconClasses} />
          ) : (
            <FlagUSIcon className={iconClasses} />
          )}
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Popover placement="left">
        <Dropdown.Menu aria-label="Switch locale">
          <Dropdown.Item
            id={LOCALE.VI}
            textValue={t('locale.vi')}
            className={cn({
              'bg-secondary/25 font-bold': locale === LOCALE.VI,
            })}
            onPress={() => onSwitchLocale(LOCALE.VI)}
          >
            <Label className="flex items-center gap-2">
              <FlagVNIcon className={iconClasses} />
              {t('locale.vi')}
            </Label>
          </Dropdown.Item>
          <Dropdown.Item
            id={LOCALE.EN}
            textValue={t('locale.en')}
            className={cn({
              'bg-secondary/25 font-bold': locale === LOCALE.EN,
            })}
            onPress={() => onSwitchLocale(LOCALE.EN)}
          >
            <Label className="flex items-center gap-2">
              <FlagUSIcon className={iconClasses} />
              {t('locale.en')}
            </Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
