import { Button, Dropdown } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';

import type { Test, TestSection } from '@/types/test';

import { useCan } from '@/configs/casl/can.config';
import { useCreateTestSection } from '@/hooks/apis/test-sections';
import { PermissionAction, SubjectName } from '@/types/auth';

import { SKILLS_BY_EXAM_TYPE } from '../constants';

type AddSectionMenuProps = {
  test: Test;
  sections: TestSection[];
  onCreated: (sectionId: number) => void;
};

const AddSectionMenu = ({ test, sections, onCreated }: AddSectionMenuProps) => {
  const { t } = useTranslation();
  const ability = useCan();
  const { mutateAsync: createSection, isPending } = useCreateTestSection();

  const remaining = SKILLS_BY_EXAM_TYPE[test.examType].filter(
    (skill) => !sections.some((section) => section.skill === skill),
  );

  if (
    test.lockedAt ||
    remaining.length === 0 ||
    !ability.can(PermissionAction.Create, SubjectName.Tests)
  )
    return null;

  const onAdd = async (skill: (typeof remaining)[number]) => {
    try {
      const section = await createSection({ testId: test.id, skill });
      if (section?.id) onCreated(section.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dropdown>
      <Button variant="outline" fullWidth isPending={isPending}>
        <LuPlus className="size-4" />
        {t('tests.editor.addSection')}
      </Button>
      <Dropdown.Popover placement="bottom">
        <Dropdown.Menu aria-label={t('tests.editor.addSection')}>
          {remaining.map((skill) => (
            <Dropdown.Item
              key={skill}
              id={skill}
              textValue={t(`tests.skill.${skill}`)}
              onPress={() => onAdd(skill)}
            >
              {t(`tests.skill.${skill}`)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default AddSectionMenu;
