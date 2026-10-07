import { Button, FieldError, Label, ListBox, Select } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetPassages } from '@/hooks/apis/passages';
import { useCreateTestSection } from '@/hooks/apis/testSections';

type AddSectionFormProps = {
  testId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const AddSectionForm = ({
  testId,
  onSuccess,
  onCancel,
}: AddSectionFormProps) => {
  const { t } = useTranslation();
  const [passageId, setPassageId] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const { data: passagesData } = useGetPassages({ take: 100 });
  const passages = passagesData?.data ?? [];

  const { mutate: createSection, isPending } = useCreateTestSection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    createSection({ testId, passageId: passageId ?? null }, { onSuccess });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-default-50 mt-2 flex flex-col gap-3 rounded-xl border p-4"
    >
      <Select
        fullWidth
        placeholder={t('tests.sections.noPassage')}
        selectedKey={passageId}
        onSelectionChange={(key) => setPassageId(key as string | null)}
      >
        <Label>{t('tests.sections.passage')}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="" textValue={t('tests.sections.noPassage')}>
              {t('tests.sections.noPassage')}
              <ListBox.ItemIndicator />
            </ListBox.Item>
            {passages.map((p) => (
              <ListBox.Item key={p.id} id={p.id} textValue={p.title ?? p.id}>
                {p.title ?? p.id}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
        {touched && <FieldError />}
      </Select>

      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="outline" onPress={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" size="sm" variant="primary" isPending={isPending}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default AddSectionForm;
