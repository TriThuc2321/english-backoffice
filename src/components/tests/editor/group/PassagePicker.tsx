import { Chip, ComboBox, Input, Label, ListBox } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';

import type { Passage } from '@/types/passage';

import { useDebounce } from '@/hooks';
import { useGetPassagesInfinity } from '@/hooks/apis/passages';

const MAX_PASSAGES = 3;

type PassageRef = { id: number; title: string };

type PassagePickerProps = {
  value: PassageRef[];
  onChange: (value: PassageRef[]) => void;
  isDisabled?: boolean;
};

const PassagePicker = ({ value, onChange, isDisabled }: PassagePickerProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data } = useGetPassagesInfinity({
    search: debouncedSearch || undefined,
  });
  const passages = (data ?? []).filter((p): p is Passage => !!p?.id);

  const options = passages.filter(
    (p) => !value.some((v) => v.id === Number(p.id)),
  );
  const isFull = value.length >= MAX_PASSAGES;

  return (
    <div className="flex flex-col gap-2">
      <ComboBox
        fullWidth
        aria-label={t('tests.editor.group.passages')}
        inputValue={search}
        onInputChange={setSearch}
        selectedKey={null}
        defaultFilter={() => true}
        isDisabled={isDisabled || isFull}
        onSelectionChange={(key) => {
          const passage = passages.find((p) => p.id === String(key));
          if (!passage) return;
          onChange([
            ...value,
            { id: Number(passage.id), title: passage.title ?? '' },
          ]);
          setSearch('');
        }}
      >
        <Label>{t('tests.editor.group.passages')}</Label>
        <ComboBox.InputGroup>
          <Input placeholder={t('tests.editor.group.passageSearch')} />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
          <ListBox>
            {options.map((passage) => (
              <ListBox.Item
                key={passage.id}
                id={passage.id}
                textValue={passage.title ?? ''}
              >
                {passage.title}
              </ListBox.Item>
            ))}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((passage) => (
            <Chip key={passage.id} color="accent" variant="soft">
              <Chip.Label>{passage.title}</Chip.Label>
              {!isDisabled && (
                <button
                  type="button"
                  aria-label={t('tests.editor.group.remove')}
                  onClick={() =>
                    onChange(value.filter((p) => p.id !== passage.id))
                  }
                >
                  <LuX className="size-3.5" />
                </button>
              )}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassagePicker;
