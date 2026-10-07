import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { ViewUser } from '@/components/users';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('User Detail', 'View CMS user details.');

export default function ViewUserPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/users" {...props} />}
        >
          {t('sidebar.users')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('cmsUsers.detailTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <ViewUser id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
