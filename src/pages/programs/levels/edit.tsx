import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { EditLevel } from '@/components/levels';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Level', 'Edit level details.');

export default function EditLevelPage() {
  const { t } = useTranslation();
  const { id, levelId } = useParams<{ id: string; levelId: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/programs" {...props} />}
        >
          {t('sidebar.programs')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item
          render={(props: any) => <Link to={`/programs/${id}`} {...props} />}
        >
          {t('programs.detailTitle')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('levels.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          {id && levelId && <EditLevel levelId={levelId} programId={id} />}
        </Card.Content>
      </Card>
    </div>
  );
}
