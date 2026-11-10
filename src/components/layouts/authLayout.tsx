import { useTranslation } from 'react-i18next';

import { LogoIcon } from '@/assets/icons';

import SwitchLocale from './switchLocale';
import ThemeSwitch from './switchTheme';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-background relative isolate flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] [background-size:44px_44px] opacity-60"
      />
      <div
        aria-hidden
        className="bg-accent/10 absolute -top-40 left-1/2 -z-10 h-80 w-[640px] -translate-x-1/2 rounded-full blur-3xl"
      />

      <div className="absolute top-4 right-4 flex items-center gap-0.5">
        <SwitchLocale />
        <ThemeSwitch />
      </div>

      <div className="flex flex-col items-center gap-2">
        <LogoIcon className="h-8 w-auto" />
        <span className="text-muted text-sm">{t('auth.tagline')}</span>
      </div>

      {children}
    </div>
  );
}
