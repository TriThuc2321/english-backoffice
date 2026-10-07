import type { SubjectType } from '@casl/ability';
import type { IconType } from 'react-icons/lib';

import { Button, cn } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosLogOut } from 'react-icons/io';
import { LuChevronDown, LuChevronLeft } from 'react-icons/lu';
import { Link, useLocation } from 'react-router';

import logoHorizontalUrl from '@/assets/icons/logo-horizontal.svg?url';
import logoUrl from '@/assets/icons/logo.svg?url';
import RenderIf from '@/components/shared/RenderIf';
import { Can } from '@/configs/casl/can.config';
import { MENU_GROUPS, type IMenuGroup } from '@/configs/menu';
import {
  SHOW_FULL_MENU_KEY,
  readShowFullMenuFromStorage,
} from '@/constants/storage';
import { useLogout } from '@/hooks/apis/auth';
import { PermissionAction } from '@/types/auth';

function getActiveSegment(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  return `/${segments[0]}`;
}

function persistShowFullMenu(value: boolean): void {
  try {
    localStorage.setItem(SHOW_FULL_MENU_KEY, String(value));
  } catch {
    // ignore
  }
}

interface ISideBarProps {
  isOpen: boolean;
  handleOpen: (isOpen: boolean) => void;
  initialShowFullMenu: boolean;
}

export default function Sidebar({
  isOpen,
  handleOpen,
  initialShowFullMenu,
}: ISideBarProps) {
  const [showFullMenu, setShowFullMenu] = useState(initialShowFullMenu);

  useEffect(() => {
    setShowFullMenu(readShowFullMenuFromStorage(initialShowFullMenu));
  }, [initialShowFullMenu]);

  const { mutate: logout } = useLogout();

  const handleShowFullMenuToggle = (open: boolean) => {
    setShowFullMenu(open);
    persistShowFullMenu(open);
  };

  return (
    <>
      <div
        className={cn(
          'bg-surface md:transition-width border-border absolute z-40 flex h-full flex-col rounded-r-3xl border-r p-2 transition-transform duration-300 max-md:-translate-x-60 lg:relative',
          {
            'max-md:translate-x-0': isOpen,
            'w-19': !showFullMenu,
            'w-60 min-w-60': showFullMenu,
          },
        )}
      >
        <Button
          className={cn(
            'absolute top-10 -right-3 size-6 min-w-6 rounded-full max-md:hidden',
            {
              'rotate-180': !showFullMenu,
            },
          )}
          isIconOnly
          variant="primary"
          onPress={() => handleShowFullMenuToggle(!showFullMenu)}
        >
          <LuChevronLeft className="text-lg" />
        </Button>
        <Link className="block" to="/">
          <img
            alt="Logo horizontal"
            className={cn('mx-auto mt-6 block h-auto w-45 object-contain', {
              hidden: !showFullMenu,
            })}
            draggable={false}
            height={32}
            src={logoHorizontalUrl}
            width={180}
          />
          <img
            alt="Logo"
            className={cn('mx-auto mt-6 h-8 w-8 object-contain', {
              hidden: showFullMenu,
            })}
            draggable={false}
            height={32}
            src={logoUrl}
          />
        </Link>

        <div className="mt-2 flex h-full flex-col gap-2 overflow-y-auto py-4">
          {MENU_GROUPS.map((group, groupIndex) => (
            <MenuGroup
              key={groupIndex}
              group={group}
              handleOpen={handleOpen}
              showFullMenu={showFullMenu}
            />
          ))}
        </div>

        <div className="mt-auto flex justify-center pt-4">
          <Button
            className={cn('flex w-full items-center justify-start gap-6 py-6', {
              'justify-center': !showFullMenu,
            })}
            isIconOnly={!showFullMenu}
            variant="outline"
            onPress={() => logout()}
          >
            <IoIosLogOut className="text-xl" />
            {showFullMenu && <p className="text-sm">Logout</p>}
          </Button>
        </div>
      </div>

      <RenderIf condition={isOpen}>
        <button
          aria-label="Close menu"
          className="absolute inset-0 z-30 bg-white/30 backdrop-blur-sm"
          tabIndex={-1}
          type="button"
          onClick={() => handleOpen(false)}
        />
      </RenderIf>
    </>
  );
}

const MenuGroup = ({
  group,
  handleOpen,
  showFullMenu,
}: {
  group: IMenuGroup;
  handleOpen: (isOpen: boolean) => void;
  showFullMenu: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      {group.label && (
        <div
          className={cn('flex items-center gap-2 px-2 pt-2', {
            'justify-center': !showFullMenu,
          })}
        >
          {showFullMenu ? (
            <p className="text-content3-foreground text-[10px] font-semibold uppercase">
              {t(group.label)}
            </p>
          ) : (
            <div className="border-border w-full border-t" />
          )}
        </div>
      )}
      {group.items.map((menu) => (
        <Can
          I={PermissionAction.Read}
          a={menu.object as SubjectType}
          key={menu.id}
        >
          <MenuItem
            {...menu}
            handleOpen={handleOpen}
            showFullMenu={showFullMenu}
          />
        </Can>
      ))}
    </div>
  );
};

type ISubMenu = {
  id: number;
  title: string;
  route: string;
  icon: IconType;
};

type IMenuItem = {
  title: string;
  id: number;
  route?: string;
  icon: IconType;
  showFullMenu: boolean;
  handleOpen: (isOpen: boolean) => void;
  subMenus?: ISubMenu[];
};

const MenuItem = ({
  title,
  icon: Icon,
  route,
  handleOpen,
  showFullMenu,
  subMenus,
}: IMenuItem) => {
  const { pathname } = useLocation();
  const segment = getActiveSegment(pathname);
  const { t } = useTranslation();

  const linkTo = route ?? subMenus?.[0]?.route;
  const hasSubMenus = Boolean(subMenus?.length);
  const isActive = !!route && route === segment;
  const isSubMenuActive =
    !!hasSubMenus && !!subMenus?.some((sub) => sub.route === segment);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(!!isSubMenuActive);

  useEffect(() => {
    if (isSubMenuActive) {
      setIsSubMenuOpen(true);
    }
  }, [isSubMenuActive]);

  const label = `sidebar.${title}`;

  const baseButtonClassName = cn(
    'flex w-full items-center justify-start gap-4 py-6 font-medium',
    {
      'justify-center': !showFullMenu,
    },
  );

  if (hasSubMenus && showFullMenu) {
    return (
      <div className="flex flex-col gap-1">
        <Button
          className={baseButtonClassName}
          isIconOnly={!showFullMenu}
          type="button"
          variant={isActive || isSubMenuActive ? 'danger-soft' : 'ghost'}
          onPress={() => {
            setIsSubMenuOpen(!isSubMenuOpen);
          }}
        >
          <Icon className="text-xl" />
          {showFullMenu && (
            <>
              <p className="flex-1 text-left text-sm">{t(label)}</p>
              <LuChevronDown
                className={cn('text-lg transition-transform duration-200', {
                  'rotate-180': isSubMenuOpen,
                })}
              />
            </>
          )}
        </Button>

        <div
          className={cn('overflow-hidden transition-all duration-200', {
            'max-h-0 opacity-0': !isSubMenuOpen,
            'max-h-125 opacity-100': isSubMenuOpen,
          })}
        >
          <div className="ml-4 flex flex-col gap-1 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
            {subMenus!.map((subMenu) => (
              <SubMenuItem
                key={subMenu.id}
                {...subMenu}
                currentSegment={segment}
                handleOpen={handleOpen}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const navTarget = linkTo ?? '/';

  return (
    <div className="flex flex-col gap-1">
      <Button
        className="w-full py-6"
        variant={isActive || isSubMenuActive ? 'danger-soft' : 'ghost'}
        isIconOnly={!showFullMenu}
        onClick={() => handleOpen(false)}
      >
        <Link
          className="flex w-full items-center justify-center gap-4 py-6 font-medium"
          to={navTarget}
        >
          <Icon className="text-xl" />
          {showFullMenu && (
            <p className="flex-1 text-left text-sm">{t(label)}</p>
          )}
        </Link>
      </Button>
    </div>
  );
};

type ISubMenuItem = {
  title: string;
  route: string;
  icon: IconType;
  handleOpen: (isOpen: boolean) => void;
  currentSegment: string;
};

const SubMenuItem = ({
  title,
  icon: Icon,
  route,
  handleOpen,
  currentSegment,
}: ISubMenuItem) => {
  const { t } = useTranslation();
  const isActive = route === currentSegment;

  return (
    <Button
      className={cn('w-full py-5', {
        'text-primary font-bold': isActive,
        'text-content2-foreground hover:text-primary/85': !isActive,
      })}
      size="sm"
      variant={isActive ? 'danger-soft' : 'ghost'}
      onClick={() => handleOpen(false)}
    >
      <Link
        className="flex w-full items-center justify-start gap-4 font-medium"
        to={route}
      >
        <Icon className="text-base" />
        <p className="text-[13px]">{t(`sidebar.${title}`)}</p>
      </Link>
    </Button>
  );
};
