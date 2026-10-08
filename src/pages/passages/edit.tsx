import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { EditPassage } from '@/components/passages';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Passage', 'Edit passage details.');

export default function EditPassagePage() {
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
        <Breadcrumbs.Item>{t('passages.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <EditPassage id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
