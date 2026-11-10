import { Button, Separator } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { FaGoogle } from 'react-icons/fa';
import { type MetaFunction, useSearchParams } from 'react-router';

import { AuthAlert, AuthCard, EmailLoginForm } from '@/components/auth';
import ENV from '@/configs/env.config';
import {
  AUTH_CLIENT,
  isLoginError,
  RESET_SUCCESS_PARAM,
} from '@/constants/auth';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta(
    'Login',
    'Sign in to access the MyEnglish management dashboard and tools.',
  );

export default function LoginPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const resetDone = searchParams.get(RESET_SUCCESS_PARAM) === 'success';

  const handleGoogleLogin = () => {
    window.location.href = `${ENV.API_URL}/api/auth/google?client=${AUTH_CLIENT}`;
  };

  return (
    <AuthCard title={t('auth.signInTitle')} subtitle={t('auth.signInSubtitle')}>
      {isLoginError(error) && <AuthAlert i18nKey={`auth.errors.${error}`} />}
      {resetDone && <AuthAlert status="success" i18nKey="auth.resetSuccess" />}

      <Button variant="outline" size="lg" fullWidth onPress={handleGoogleLogin}>
        <FaGoogle className="size-4" />
        {t('auth.continueWithGoogle')}
      </Button>

      <div className="text-muted flex items-center gap-3 text-xs">
        <Separator className="flex-1" />
        {t('auth.orWithEmail')}
        <Separator className="flex-1" />
      </div>

      <EmailLoginForm />
    </AuthCard>
  );
}
