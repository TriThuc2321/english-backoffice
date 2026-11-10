import { Button, Form, Link } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { LOGIN_PATH, RESET_SUCCESS_PARAM } from '@/constants/auth';
import { useForgotPassword, useResetPassword } from '@/hooks/apis/auth';
import { useForgotPasswordForm, useResetPasswordForm } from '@/hooks/forms';
import { getAuthErrorKey } from '@/utils/authError';

import AuthAlert from './AuthAlert';
import AuthCard from './AuthCard';
import AuthField from './AuthField';
import AuthOtpField from './AuthOtpField';

export default function ForgotPasswordFlow() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const emailForm = useForgotPasswordForm();
  const resetForm = useResetPasswordForm();
  const forgot = useForgotPassword();
  const resetPassword = useResetPassword();

  const onSendCode = emailForm.handleSubmit(({ email: value }) => {
    forgot.mutate({ email: value }, { onSuccess: () => setEmail(value) });
  });

  const onResend = () => {
    if (!email) return;
    setResent(false);
    forgot.mutate({ email }, { onSuccess: () => setResent(true) });
  };

  const onReset = resetForm.handleSubmit(({ code, newPassword }) => {
    if (!email) return;
    resetPassword.mutate(
      { email, code, newPassword },
      {
        onSuccess: () =>
          navigate(`${LOGIN_PATH}?${RESET_SUCCESS_PARAM}=success`, {
            replace: true,
          }),
      },
    );
  });

  const backLink = (
    <Link
      href={LOGIN_PATH}
      className="text-accent self-center text-sm font-medium"
    >
      {t('auth.backToSignIn')}
    </Link>
  );

  if (!email) {
    return (
      <AuthCard
        title={t('auth.forgotTitle')}
        subtitle={t('auth.forgotSubtitle')}
      >
        <Form
          validationBehavior="aria"
          className="flex flex-col gap-4"
          onSubmit={onSendCode}
        >
          {forgot.error && (
            <AuthAlert
              i18nKey={`auth.errors.${getAuthErrorKey(forgot.error)}`}
            />
          )}
          <AuthField
            control={emailForm.control}
            name="email"
            type="email"
            autoComplete="email"
            label={t('auth.email')}
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            isPending={forgot.isPending}
          >
            {t('auth.sendCode')}
          </Button>
        </Form>
        {backLink}
      </AuthCard>
    );
  }

  const error = resetPassword.error ?? forgot.error;

  return (
    <AuthCard
      title={t('auth.resetTitle')}
      subtitle={t('auth.resetSubtitle', { email })}
    >
      <Form
        validationBehavior="aria"
        className="flex flex-col gap-4"
        onSubmit={onReset}
      >
        {error && (
          <AuthAlert i18nKey={`auth.errors.${getAuthErrorKey(error)}`} />
        )}
        {resent && !error && (
          <p className="text-success text-center text-sm">
            {t('auth.codeResent')}
          </p>
        )}
        <AuthOtpField
          control={resetForm.control}
          name="code"
          label={t('auth.code')}
          labelAside={
            <Link
              className="text-accent text-sm font-medium"
              isDisabled={forgot.isPending}
              onPress={onResend}
            >
              {t('auth.resendCode')}
            </Link>
          }
        />
        <AuthField
          control={resetForm.control}
          name="newPassword"
          type="password"
          autoComplete="new-password"
          label={t('auth.newPassword')}
        />
        <AuthField
          control={resetForm.control}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          label={t('auth.confirmPassword')}
        />
        <Button
          type="submit"
          size="lg"
          fullWidth
          isPending={resetPassword.isPending}
        >
          {t('auth.resetButton')}
        </Button>
      </Form>
      <div className="flex flex-col items-center gap-2">
        <Link
          className="text-muted text-sm"
          onPress={() => {
            forgot.reset();
            resetPassword.reset();
            resetForm.reset();
            setResent(false);
            setEmail(null);
          }}
        >
          {t('auth.useAnotherEmail')}
        </Link>
        {backLink}
      </div>
    </AuthCard>
  );
}
