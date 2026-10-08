import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { ViewPassage } from '@/components/passages';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Passage Detail', 'View passage details.');

export default function ViewPassagePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/passages" {...props} />}
        >
          {t('sidebar.passages')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('passages.detailTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card>
        <Card.Content>{id && <ViewPassage id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
