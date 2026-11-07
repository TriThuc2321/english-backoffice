import type { Key } from '@heroui/react';

import { FieldError, Label, ListBox, Select } from '@heroui/react';

import { BAND_STEPS } from '@/constants/grading';

type CriterionSelectProps = {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
  isDisabled?: boolean;
};

const CriterionSelect = ({
  label,
  value,
  onChange,
  error,
  isDisabled,
}: CriterionSelectProps) => (
  <Select
    fullWidth
    isDisabled={isDisabled}
    isInvalid={!!error}
    selectedKey={value === null ? null : String(value)}
    onSelectionChange={(key: Key | null) =>
      key != null && onChange(Number(key))
    }
  >
    <Label>{label}</Label>
    <Select.Trigger>
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {BAND_STEPS.map((step) => (
          <ListBox.Item key={step} id={String(step)} textValue={String(step)}>
            {step}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
    <FieldError>{error}</FieldError>
  </Select>
);

export default CriterionSelect;
