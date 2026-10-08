import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, type MetaFunction } from 'react-router';

import { CreatePassage } from '@/components/passages';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Passage', 'Create a new reading passage.');

export default function CreatePassagePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/passages" {...props} />}
        >
          {t('sidebar.passages')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('passages.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreatePassage />
        </Card.Content>
      </Card>
    </div>
  );
}
