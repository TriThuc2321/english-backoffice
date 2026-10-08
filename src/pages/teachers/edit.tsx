import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { EditTeacher } from '@/components/teachers';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Teacher', 'Edit teacher details.');

export default function EditTeacherPage() {
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
        <Breadcrumbs.Item>{t('teachers.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <EditTeacher id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
