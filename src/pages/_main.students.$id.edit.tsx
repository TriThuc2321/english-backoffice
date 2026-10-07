import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { EditStudent } from '@/components/students';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Student', 'Edit student details.');

export default function EditStudentPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/students" {...props} />}
        >
          {t('sidebar.students')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('students.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <EditStudent id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
