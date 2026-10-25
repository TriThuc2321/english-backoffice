import type { Key } from '@heroui/react';

import { Label, ListBox, Select } from '@heroui/react';

type FilterSelectProps = {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  isDisabled,
  className = 'md:w-44',
}: FilterSelectProps) => (
  <Select
    className={className}
    isDisabled={isDisabled}
    selectedKey={value}
    onSelectionChange={(key: Key | null) =>
      key != null && onChange(String(key))
    }
  >
    <Label>{label}</Label>
    <Select.Trigger>
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {options.map((option) => (
          <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
            {option.label}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
);

export default FilterSelect;
