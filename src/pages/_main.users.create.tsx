import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, type MetaFunction } from 'react-router';

import { CreateUser } from '@/components/users';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create User', 'Create a new CMS user.');

export default function CreateUserPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/users" {...props} />}
        >
          {t('sidebar.users')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('cmsUsers.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreateUser />
        </Card.Content>
      </Card>
    </div>
  );
}
