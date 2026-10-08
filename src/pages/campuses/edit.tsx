import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { EditCampus } from '@/components/campuses';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Campus', 'Edit campus details.');

export default function EditCampusPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/campuses" {...props} />}
        >
          {t('sidebar.campuses')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('campuses.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <EditCampus id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
