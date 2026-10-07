import { type ReactNode, useCallback, useState } from 'react';

import Header from './header';
import Sidebar from './sidebar';

type MainLayoutProps = {
  children: ReactNode;
  initialShowFullMenu: boolean;
};

export default function MainLayout({
  children,
  initialShowFullMenu = true,
}: MainLayoutProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSetIsOpen = (isOpen: boolean) => setIsOpen(isOpen);

  const onChangeOpenSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="bg-background flex h-screen w-full flex-col overflow-hidden pl-0 md:flex-row">
      <Sidebar
        isOpen={isOpen}
        handleOpen={handleSetIsOpen}
        initialShowFullMenu={initialShowFullMenu}
      />

      <div className="bg-background flex h-full w-full flex-col gap-4 overflow-hidden rounded-xl p-2 md:px-6 md:py-5">
        <Header onChangeOpenSidebar={onChangeOpenSidebar} />

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
