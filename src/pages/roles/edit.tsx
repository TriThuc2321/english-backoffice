import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';

import { EditRole } from '@/components/roles';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Role', 'Edit role details and permissions.');

export default function EditRolePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/roles">{t('sidebar.roles')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('roles.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <EditRole id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
