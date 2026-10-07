import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { FaGoogle } from 'react-icons/fa';
import { type MetaFunction } from 'react-router';

import { LogoIcon } from '@/assets/icons';
import SwitchLocale from '@/components/layouts/switchLocale';
import ThemeSwitch from '@/components/layouts/switchTheme';
import ENV from '@/configs/env.config';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta(
    'Login',
    'Sign in with Google to access the MyEnglish management dashboard and tools.',
  );

export default function LoginPage() {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    window.location.href = `${ENV.API_URL}/api/auth/google`;
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <SwitchLocale />
        <ThemeSwitch />
      </div>

      <div className="mb-8">
        <LogoIcon className="h-8" />
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          {t('auth.welcomeBack')}
        </h1>
        <p className="text-default-700 max-w-md text-lg">
          {t('auth.welcomeSubtitle')}
        </p>
      </div>

      <Button size="lg" onClick={handleGoogleLogin} className="w-full">
        <FaGoogle className="h-5 w-5 text-white" />
        {t('auth.continueWithGoogle')}
      </Button>

      <p className="text-default-600 mt-4 text-center text-sm">
        {t('auth.loginFooter')}
      </p>
    </div>
  );
}
