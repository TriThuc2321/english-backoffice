import { Button, Form, Link } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { FORGOT_PASSWORD_PATH } from '@/constants/auth';
import { useLogin } from '@/hooks/apis/auth';
import { useLoginForm } from '@/hooks/forms';
import { getAuthErrorKey } from '@/utils/authError';

import AuthAlert from './AuthAlert';
import AuthField from './AuthField';

export default function EmailLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { control, handleSubmit } = useLoginForm();
  const { mutate, isPending, error, reset } = useLogin();

  const onSubmit = handleSubmit((values) => {
    reset();
    mutate(values, { onSuccess: () => navigate('/', { replace: true }) });
  });

  return (
    <Form
      validationBehavior="aria"
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      {error && <AuthAlert i18nKey={`auth.errors.${getAuthErrorKey(error)}`} />}

      <AuthField
        control={control}
        name="email"
        type="email"
        autoComplete="email"
        label={t('auth.email')}
      />

      <AuthField
        control={control}
        name="password"
        type="password"
        autoComplete="current-password"
        label={t('auth.password')}
        labelAside={
          <Link
            href={FORGOT_PASSWORD_PATH}
            className="text-accent text-sm font-medium"
          >
            {t('auth.forgotPassword')}
          </Link>
        }
      />

      <Button type="submit" size="lg" fullWidth isPending={isPending}>
        {t('auth.loginButton')}
      </Button>
    </Form>
  );
}
