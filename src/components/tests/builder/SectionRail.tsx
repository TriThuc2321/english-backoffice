import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';

import type { QuestionGroup, TestSection } from '@/types/test';

import MyButton from '@/components/shared/Button';
import { PermissionAction, SubjectName } from '@/types/auth';

import type { Numbering } from './utils';

import RailSectionCard from './RailSectionCard';

type SectionRailProps = {
  sections: TestSection[];
  groupsBySection: Record<string, QuestionGroup[]>;
  numbering: Numbering;
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
  onAdd: () => void;
  isAdding: boolean;
  onDelete: (sectionId: string) => void;
  deletingSectionId: string | null;
};

const SectionRail = ({
  sections,
  groupsBySection,
  numbering,
  selectedSectionId,
  onSelect,
  onAdd,
  isAdding,
  onDelete,
  deletingSectionId,
}: SectionRailProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-col gap-2 border-b p-3 xl:border-r xl:border-b-0">
      <span className="text-default-400 px-1 font-mono text-xs tracking-wide uppercase">
        {t('tests.builder.rail.title')}
      </span>

      <div className="flex min-h-0 gap-2 overflow-x-auto xl:flex-1 xl:flex-col xl:overflow-x-visible xl:overflow-y-auto">
        {sections.map((section, index) => (
          <RailSectionCard
            key={section.id}
            section={section}
            order={section.order ?? index + 1}
            groups={groupsBySection[section.id] ?? []}
            questionCount={numbering.countBySectionId[section.id] ?? 0}
            isActive={section.id === selectedSectionId}
            onSelect={() => onSelect(section.id)}
            onDelete={() => onDelete(section.id)}
            isDeleting={deletingSectionId === section.id}
          />
        ))}

        <MyButton
          I={PermissionAction.Create}
          a={SubjectName.Tests}
          size="sm"
          variant="ghost"
          isPending={isAdding}
          onPress={onAdd}
          className="border-default-300 text-default-500 w-56 shrink-0 justify-center rounded-xl border border-dashed xl:w-full"
        >
          <LuPlus className="size-3.5" />
          {t('tests.builder.rail.addSection')}
        </MyButton>
      </div>
    </div>
  );
};

export default SectionRail;
