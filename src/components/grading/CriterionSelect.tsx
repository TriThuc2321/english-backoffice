import type { Key } from '@heroui/react';

import { ToggleButton, ToggleButtonGroup } from '@heroui/react';
import { useId } from 'react';

import { BAND_STEPS } from '@/constants/grading';

type CriterionSelectProps = {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
  isDisabled?: boolean;
};

// Whole bands on the top row, half bands below and between them
const placement = (step: number) =>
  Number.isInteger(step)
    ? { gridRow: 1, gridColumn: `${step * 2 + 1} / span 2` }
    : { gridRow: 2, gridColumn: `${step * 2 + 1} / span 2` };

const CriterionSelect = ({
  label,
  value,
  onChange,
  error,
  isDisabled,
}: CriterionSelectProps) => {
  const labelId = useId();
  const errorId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span id={labelId} className="text-sm font-medium">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {value ?? '—'}
        </span>
      </div>
      <ToggleButtonGroup
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        selectionMode="single"
        disallowEmptySelection
        isDetached
        size="sm"
        isDisabled={isDisabled}
        selectedKeys={value === null ? [] : [String(value)]}
        onSelectionChange={(keys: Set<Key>) => {
          const [key] = keys;
          if (key != null) onChange(Number(key));
        }}
        className="grid w-full grid-cols-[repeat(20,minmax(0,1fr))] gap-1"
      >
        {BAND_STEPS.map((step) => (
          <ToggleButton
            key={step}
            id={String(step)}
            style={placement(step)}
            className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground h-7 w-full min-w-0 px-0 tabular-nums"
          >
            {step}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {error && (
        <p id={errorId} className="text-danger text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

export default CriterionSelect;
