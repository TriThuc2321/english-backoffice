import { Breadcrumbs } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';

import { TestPreview } from '@/components/tests';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Preview Test', 'Preview an IELTS test as a student.');

export default function PreviewTestPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const testId = Number(id) || undefined;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/tests">{t('sidebar.tests')}</Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/tests/${id}/edit`}>
          {t('tests.editTitle')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('tests.preview.title')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <TestPreview id={testId} />
    </div>
  );
}
