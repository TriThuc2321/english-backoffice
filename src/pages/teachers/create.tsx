import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, type MetaFunction } from 'react-router';

import { CreateTeacher } from '@/components/teachers';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Teacher', 'Create a new teacher.');

export default function CreateTeacherPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/teachers" {...props} />}
        >
          {t('sidebar.teachers')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('teachers.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreateTeacher />
        </Card.Content>
      </Card>
    </div>
  );
}
