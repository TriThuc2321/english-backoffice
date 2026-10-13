import { Breadcrumbs } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';

import { TestEditor } from '@/components/tests';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Test', 'Edit IELTS test details.');

export default function EditTestPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/tests">{t('sidebar.tests')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('tests.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      {id && <TestEditor id={Number(id)} />}
    </div>
  );
}
