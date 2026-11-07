import { Breadcrumbs } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { useParams, type MetaFunction } from 'react-router';

import { GradingWorkspace } from '@/components/grading';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Grade Section', 'Grade an IELTS Writing or Speaking section.');

export default function GradeSectionPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/grading">
          {t('sidebar.grading')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('grading.screen.breadcrumb')}</Breadcrumbs.Item>
      </Breadcrumbs>
      {id && <GradingWorkspace key={id} id={id} />}
    </div>
  );
}
