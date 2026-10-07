import { Button, Card } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronLeft } from 'react-icons/lu';
import { useNavigate, type MetaFunction } from 'react-router';

import { CreateTest } from '@/components/tests';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta('Create Test', 'Create a new IELTS test.');

export default function CreateTestPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onPress={() => navigate('/tests')}
          className="-ml-2"
        >
          <LuChevronLeft className="size-4" />
          {t('tests.builder.backToTests')}
        </Button>
        <h1 className="text-default-900 text-lg font-semibold">
          {t('tests.createTitle')}
        </h1>
      </div>

      <Card className="mx-auto w-full max-w-2xl">
        <Card.Content>
          <CreateTest />
        </Card.Content>
      </Card>
    </div>
  );
}
