import { Breadcrumbs } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';

import { AttemptResultView } from '@/components/attempts';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Attempt Result', "Review a student's scores and answers.");

export default function AttemptResultPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/attempts">
          {t('sidebar.attempts')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('attempts.result.breadcrumb')}</Breadcrumbs.Item>
      </Breadcrumbs>
      {id && <AttemptResultView key={id} id={id} />}
    </div>
  );
}
