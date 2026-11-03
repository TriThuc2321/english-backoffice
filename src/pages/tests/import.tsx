import type { MetaFunction } from 'react-router';

import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { ImportTest } from '@/components/tests';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Import Test', 'Import a test from JSON.');

export default function ImportTestPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/tests">{t('sidebar.tests')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('tests.import.title')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-4xl">
        <Card.Content>
          <ImportTest />
        </Card.Content>
      </Card>
    </div>
  );
}
