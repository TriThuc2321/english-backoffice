import { Button, Skeleton } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';

import MyButton from '@/components/shared/Button';
import { useGetTestSectionsByTestId } from '@/hooks/apis/testSections';
import { PermissionAction, SubjectName } from '@/types/auth';

import AddSectionForm from './AddSectionForm';
import SectionCard from './SectionCard';

type TestSectionsBuilderProps = {
  testId: string;
};

const TestSectionsBuilder = ({ testId }: TestSectionsBuilderProps) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: sections, isLoading } = useGetTestSectionsByTestId(testId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-default-900 text-base font-semibold">
          {t('tests.sections.title')}
        </h2>
        {!showAddForm && (
          <MyButton
            I={PermissionAction.Create}
            a={SubjectName.Tests}
            size="sm"
            variant="primary"
            onPress={() => setShowAddForm(true)}
          >
            <LuPlus className="size-4" />
            {t('tests.sections.addSection')}
          </MyButton>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      ) : sections && sections.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      ) : (
        !showAddForm && (
          <div className="text-default-400 rounded-xl border border-dashed py-10 text-center text-sm">
            {t('tests.sections.noSections')}
          </div>
        )
      )}

      {showAddForm && (
        <AddSectionForm
          testId={testId}
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showAddForm && (
        <div className="flex justify-start">
          <Button
            size="sm"
            variant="outline"
            onPress={() => setShowAddForm(false)}
          >
            {t('common.cancel')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestSectionsBuilder;
