import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';

import { ViewMedia } from '@/components/media';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Media Detail', 'View and edit an uploaded file.');

export default function ViewMediaPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/media">{t('sidebar.media')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('media.detailTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <ViewMedia id={Number(id)} />}</Card.Content>
      </Card>
    </div>
  );
}
