import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, type MetaFunction } from 'react-router';

import { EditProgram } from '@/components/programs';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Edit Program', 'Edit program details.');

export default function EditProgramPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/programs" {...props} />}
        >
          {t('sidebar.programs')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('programs.editTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>{id && <EditProgram id={id} />}</Card.Content>
      </Card>
    </div>
  );
}
