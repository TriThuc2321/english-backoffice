import { Avatar, Button } from '@heroui/react';
import { memo } from 'react';
import { LuMenu } from 'react-icons/lu';

import { useGetProfile } from '@/hooks/apis/users';

import SwitchLocale from './switchLocale';
import ThemeSwitch from './switchTheme';

type HeaderProps = {
  onChangeOpenSidebar: () => void;
};
function Header({ onChangeOpenSidebar }: HeaderProps) {
  const { data } = useGetProfile();
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

        <Button variant="ghost" className="h-12 pr-1 max-md:hidden">
          <div>
            <p className="text-end text-sm font-semibold">{fallbackName}</p>
            <p className="text-xs text-gray-500">{email ?? ''}</p>
          </div>
          <Avatar className="rounded-2xl" variant="soft" color="accent">
            <Avatar.Image alt={fallbackName} src={avatar} />
            <Avatar.Fallback className="rounded-2xl">
              {fallbackInitials}
            </Avatar.Fallback>
          </Avatar>
        </Button>
      </div>
    </div>
  );
}

export default memo(Header);
