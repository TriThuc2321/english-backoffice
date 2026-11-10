import { Alert } from '@heroui/react';
import { useTranslation } from 'react-i18next';

type AuthAlertProps = {
  i18nKey: string;
  status?: 'danger' | 'success';
};

export default function AuthAlert({
  i18nKey,
  status = 'danger',
}: AuthAlertProps) {
  const { t } = useTranslation();

  return (
    <Alert
      status={status}
      className={
        status === 'danger'
          ? 'bg-danger-soft border-danger border'
          : 'bg-success-soft border-success border'
      }
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{t(`${i18nKey}.title`)}</Alert.Title>
        <Alert.Description>{t(`${i18nKey}.description`)}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
