import type { SubjectType } from '@casl/ability';
import type { IconType } from 'react-icons/lib';

import {
  Button,
  Disclosure,
  Separator,
  Tooltip,
  buttonVariants,
  cn,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosLogOut } from 'react-icons/io';
import { LuChevronLeft } from 'react-icons/lu';
import { Link, useLocation } from 'react-router';

import logoHorizontalUrl from '@/assets/icons/logo-horizontal.svg?url';
import logoUrl from '@/assets/icons/logo.svg?url';
import RenderIf from '@/components/shared/RenderIf';
import { Can, useCan } from '@/configs/casl/can.config';
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

function menuItemStateClassName(isActive: boolean) {
  return isActive
    ? 'bg-accent/10 text-accent hover:bg-accent/15'
    : 'text-foreground';
}

function menuItemClassName(isActive: boolean, showFullMenu = true) {
  return buttonVariants({
    className: cn(
      'text-sm font-medium',
      showFullMenu ? 'justify-start gap-3' : 'mx-auto',
      menuItemStateClassName(isActive),
    ),
    fullWidth: showFullMenu,
    isIconOnly: !showFullMenu,
    variant: 'ghost',
    size: 'lg',
  });
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

  const { t } = useTranslation();
  const { mutate: logout } = useLogout();

  const handleShowFullMenuToggle = (open: boolean) => {
    setShowFullMenu(open);
    persistShowFullMenu(open);
  };

  return (
    <>
      <div
        className={cn(
          'bg-surface md:transition-width absolute z-40 flex h-full flex-col rounded-r-3xl p-2 transition-transform duration-300 max-md:-translate-x-60 lg:relative',
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
            className={cn(
              'mx-auto mt-6 block h-auto w-45 object-contain dark:brightness-150',
              {
                hidden: !showFullMenu,
              },
            )}
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

        <div className="mt-2 flex h-full flex-col gap-1 overflow-y-auto py-4">
          {MENU_GROUPS.map((group, groupIndex) => (
            <MenuGroup
              key={groupIndex}
              group={group}
              handleOpen={handleOpen}
              showFullMenu={showFullMenu}
            />
          ))}
        </div>

        <div className="mt-auto">
          <Separator className="my-2" />
          <Button
            size="lg"
            aria-label={showFullMenu ? undefined : t('nav.logout')}
            className={cn(
              'text-muted hover:text-foreground text-sm font-medium',
              {
                'justify-start gap-3': showFullMenu,
                'mx-auto flex': !showFullMenu,
              },
            )}
            fullWidth={showFullMenu}
            isIconOnly={!showFullMenu}
            variant="ghost"
            onPress={() => logout()}
          >
            <IoIosLogOut className="shrink-0 text-lg" />
            {showFullMenu && t('nav.logout')}
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
  const ability = useCan();

  const hasVisibleItem = group.items.some((menu) =>
    ability.can(PermissionAction.Read, menu.object as SubjectType),
  );

  if (!hasVisibleItem) return null;

  return (
    <div className="flex flex-col gap-1">
      {group.label &&
        (showFullMenu ? (
          <p className="text-muted px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider uppercase">
            {t(group.label)}
          </p>
        ) : (
          <Separator className="mx-auto my-2 w-6" />
        ))}
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

  const label = t(`sidebar.${title}`);

  if (hasSubMenus && showFullMenu) {
    return (
      <Disclosure
        isExpanded={isSubMenuOpen}
        onExpandedChange={setIsSubMenuOpen}
      >
        <Disclosure.Heading>
          <Button
            className={cn(
              'justify-start gap-3 font-medium',
              menuItemStateClassName(isSubMenuActive),
            )}
            fullWidth
            slot="trigger"
            variant="ghost"
          >
            <Icon className="shrink-0 text-lg" />
            <span className="flex-1 truncate text-left">{label}</span>
            <Disclosure.Indicator />
          </Button>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body className="border-border ml-5 flex flex-col gap-0.5 border-l py-1 pl-2">
            {subMenus!.map((subMenu) => (
              <SubMenuItem
                key={subMenu.id}
                {...subMenu}
                currentSegment={segment}
                handleOpen={handleOpen}
              />
            ))}
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    );
  }

  const link = (
    <Link
      aria-label={showFullMenu ? undefined : label}
      className={menuItemClassName(isActive || isSubMenuActive, showFullMenu)}
      to={linkTo ?? '/'}
      onClick={() => handleOpen(false)}
    >
      <Icon className="shrink-0 text-lg" />
      {showFullMenu && <span className="flex-1 truncate">{label}</span>}
    </Link>
  );

  if (showFullMenu) return link;

  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger className="flex">{link}</Tooltip.Trigger>
      <Tooltip.Content placement="right">{label}</Tooltip.Content>
    </Tooltip>
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
    <Link
      className={buttonVariants({
        className: cn(
          'justify-start gap-3 font-medium',
          menuItemStateClassName(isActive),
        ),
        fullWidth: true,
        size: 'sm',
        variant: 'ghost',
      })}
      to={route}
      onClick={() => handleOpen(false)}
    >
      <Icon className="shrink-0 text-base" />
      <span className="truncate">{t(`sidebar.${title}`)}</span>
    </Link>
  );
};
