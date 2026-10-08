import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { ViewTeacher } from '@/components/teachers';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Teacher Detail', 'View teacher details.');

export default function ViewTeacherPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/teachers" {...props} />}
        >
          {t('sidebar.teachers')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('teachers.detailTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <ViewTeacher id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
