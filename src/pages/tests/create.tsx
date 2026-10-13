import type { MetaFunction } from 'react-router';

import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { CreateTest } from '@/components/tests';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Test', 'Create a new IELTS test.');

export default function CreateTestPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/tests">{t('sidebar.tests')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('tests.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreateTest />
        </Card.Content>
      </Card>
    </div>
  );
}
