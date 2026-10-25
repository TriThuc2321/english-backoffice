import { Avatar, Button, Dropdown, Label } from '@heroui/react';
import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LuMenu, LuTrash2, LuUpload } from 'react-icons/lu';

import { AVATAR_CONTENT_TYPES } from '@/constants/media';
import { useGetProfile, useSetMyAvatar } from '@/hooks/apis/users';

import SwitchLocale from './switchLocale';
import ThemeSwitch from './switchTheme';

type HeaderProps = {
  onChangeOpenSidebar: () => void;
};
function Header({ onChangeOpenSidebar }: HeaderProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useGetProfile();
  const { mutate: setAvatar, isPending: isSettingAvatar } = useSetMyAvatar();
  const { firstName, lastName, email, avatar } = data || {};
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const fallbackName = fullName || email || 'MyEnglish User';
  const firstInitial = firstName?.charAt(0) ?? '';
  const lastInitial = lastName?.charAt(0) ?? '';
  const fallbackInitials = (firstInitial + lastInitial || 'ME').toUpperCase();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          className="hidden max-md:flex"
          isIconOnly
          variant="tertiary"
          onPress={onChangeOpenSidebar}
        >
          <LuMenu className="text-xl" />
        </Button>
        <h5 className="font-bold">Welcome to My English</h5>
      </div>

      <div className="flex items-center gap-2">
        <SwitchLocale />
        <ThemeSwitch />

        <Dropdown>
          <Button
            variant="ghost"
            className="h-12 pr-1 max-md:hidden"
            isPending={isSettingAvatar}
          >
            <div>
              <p className="text-end text-sm font-semibold">{fallbackName}</p>
              <p className="text-xs text-gray-500">{email ?? ''}</p>
            </div>
            <Avatar className="rounded-field" variant="soft" color="accent">
              <Avatar.Image alt={fallbackName} src={avatar} />
              <Avatar.Fallback className="rounded-field">
                {fallbackInitials}
              </Avatar.Fallback>
            </Avatar>
          </Button>

          <Dropdown.Popover placement="bottom end">
            <Dropdown.Menu aria-label={t('avatar.menu')}>
              <Dropdown.Item
                id="change-avatar"
                textValue={t('avatar.change')}
                onPress={() => inputRef.current?.click()}
              >
                <Label className="flex items-center gap-2">
                  <LuUpload className="size-4" />
                  {t('avatar.change')}
                </Label>
              </Dropdown.Item>
              {avatar ? (
                <Dropdown.Item
                  id="remove-avatar"
                  textValue={t('avatar.remove')}
                  className="text-danger"
                  onPress={() => setAvatar(null)}
                >
                  <Label className="flex items-center gap-2">
                    <LuTrash2 className="size-4" />
                    {t('avatar.remove')}
                  </Label>
                </Dropdown.Item>
              ) : null}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept={AVATAR_CONTENT_TYPES.join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setAvatar(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

export default memo(Header);
