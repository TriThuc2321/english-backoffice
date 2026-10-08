import { Breadcrumbs, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { Link, type MetaFunction } from 'react-router';

import { CreateProgram } from '@/components/programs';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Program', 'Create a new program.');

export default function CreateProgramPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item
          render={(props: any) => <Link to="/programs" {...props} />}
        >
          {t('sidebar.programs')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('programs.createTitle')}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Card className="mx-auto w-full max-w-3xl">
        <Card.Content>
          <CreateProgram />
        </Card.Content>
      </Card>
    </div>
  );
}
