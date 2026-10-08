import type { MetaFunction } from 'react-router';

import { Breadcrumbs, Card, CardContent } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { CreateRole } from '@/components/roles';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Role', 'Create a new role with custom permissions.');

export default function CreateRolePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/roles">{t('sidebar.roles')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('roles.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <CardContent>
          <CreateRole />
        </CardContent>
      </Card>
    </div>
  );
}
