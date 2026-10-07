import { Button, ListBox, Select } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuBookOpen } from 'react-icons/lu';

import type { TestSection } from '@/types/test';

import { useGetPassages } from '@/hooks/apis/passages';
import { useEditTestSection } from '@/hooks/apis/testSections';

type PassagePickerProps = {
  section: TestSection;
};

const PassagePicker = ({ section }: PassagePickerProps) => {
  const { t } = useTranslation();
  const { data: passagesData } = useGetPassages({ take: 100 });
  const passages = passagesData?.data ?? [];
  const { mutate: editSection, isPending } = useEditTestSection();

  if (section.passage) {
    const paragraphCount = section.passage.paragraphs?.length;

    return (
      <div className="border-accent/40 bg-accent/5 flex items-center gap-3 rounded-xl border p-3">
        <div className="bg-accent/15 text-accent flex size-9 shrink-0 items-center justify-center rounded-lg">
          <LuBookOpen className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-default-900 truncate text-sm font-medium">
            {section.passage.title}
          </p>
          {paragraphCount != null && paragraphCount > 0 && (
            <p className="text-default-500 text-xs">
              {t('tests.builder.detail.passage.paragraphs', {
                count: paragraphCount,
              })}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          isPending={isPending}
          onPress={() => editSection({ id: section.id, passageId: null })}
        >
          {t('tests.builder.detail.passage.clear')}
        </Button>
      </div>
    );
  }

  return (
    <Select
      aria-label={t('tests.builder.detail.passage.label')}
      placeholder={t('tests.builder.detail.passage.select')}
      fullWidth
      selectedKey={null}
      isDisabled={isPending}
      onSelectionChange={(key) => {
        if (key == null) return;
        editSection({ id: section.id, passageId: String(key) });
      }}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {passages.map((passage) => (
            <ListBox.Item
              key={passage.id}
              id={passage.id}
              textValue={passage.title ?? passage.id}
            >
              {passage.title}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default PassagePicker;
