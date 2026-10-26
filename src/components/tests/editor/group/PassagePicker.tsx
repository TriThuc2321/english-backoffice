import { Chip, ComboBox, Input, Label, ListBox } from '@heroui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';

import type { Passage } from '@/types/passage';

import { MAX_GROUP_PASSAGES } from '@/constants/questionTypes';
import { useDebounce } from '@/hooks';
import { useGetPassagesInfinity } from '@/hooks/apis/passages';

export type PassageRef = { id: number; title: string };

type PassagePickerProps = {
  value: PassageRef[];
  onChange: (value: PassageRef[]) => void;
  max?: number;
  label?: string;
  isDisabled?: boolean;
};

const PassagePicker = ({
  value,
  onChange,
  max = MAX_GROUP_PASSAGES,
  label,
  isDisabled,
}: PassagePickerProps) => {
  const { t } = useTranslation();
  const labelText = label ?? t('tests.editor.group.passages');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data } = useGetPassagesInfinity({
    search: debouncedSearch || undefined,
  });
  const passages = (data ?? []).filter((p): p is Passage => !!p?.id);

  // Don't disable when full: disabling mid-selection leaves the popover stuck open
  const isFull = max > 1 && value.length >= max;
  const options = isFull
    ? []
    : passages.filter((p) => !value.some((v) => v.id === Number(p.id)));

  return (
    <div className="flex flex-col gap-2">
      <ComboBox
        fullWidth
        aria-label={labelText}
        inputValue={search}
        onInputChange={setSearch}
        selectedKey={null}
        defaultFilter={() => true}
        isDisabled={isDisabled}
        onSelectionChange={(key) => {
          const passage = passages.find((p) => String(p.id) === String(key));
          if (!passage) return;
          const picked = { id: Number(passage.id), title: passage.title ?? '' };
          onChange(max === 1 ? [picked] : [...value, picked]);
          setSearch('');
        }}
      >
        <Label>{labelText}</Label>
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
