import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, type MetaFunction } from 'react-router';

import { CreateCampus } from '@/components/campuses';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Campus', 'Create a new campus.');

export default function CreateCampusPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/campuses" {...props} />}
        >
          {t('sidebar.campuses')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('campuses.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreateCampus />
        </Card.Content>
      </Card>
    </div>
  );
}
