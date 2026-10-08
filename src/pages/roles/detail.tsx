import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { ViewRole } from '@/components/roles';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Role Detail', 'View role details and permissions.');

export default function ViewRolePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/roles" {...props} />}
        >
          {t('sidebar.roles')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('roles.detailTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <ViewRole id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
