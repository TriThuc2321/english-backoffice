import { Button } from '@heroui/react';
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

import { useTheme } from '@/providers/theme.provider';

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  const isLight = theme === 'light';

  return (
    <Button
      variant="tertiary"
      isIconOnly
      className="rounded-full"
      onPress={() => setTheme(isLight ? 'dark' : 'light')}
    >
      {isLight ? <IoSunnyOutline size={12} /> : <IoMoonOutline size={12} />}
    </Button>
  );
}
