import type { MetaFunction } from 'react-router';

import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import { CreateStudent } from '@/components/students';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Student', 'Create a new student.');

export default function CreateStudentPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/students">
          {t('sidebar.students')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('students.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreateStudent />
        </Card.Content>
      </Card>
    </div>
  );
}
