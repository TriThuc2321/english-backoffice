import {
  Description,
  FieldError,
  Input,
  Label,
  TextArea,
  TextField,
} from '@heroui/react';

import { toNumber } from './utils';

type BaseProps = {
  label?: string;
  description?: string;
  error?: string;
  isDisabled?: boolean;
  placeholder?: string;
  className?: string;
};

type NumberInputProps = BaseProps & {
  value: number | undefined | null;
  onChange: (value: number | undefined) => void;
  min?: number;
};

export const NumberInput = ({
  label,
  description,
  error,
  isDisabled,
  placeholder,
  className,
  value,
  onChange,
  min = 0,
}: NumberInputProps) => (
  <TextField
    fullWidth
    className={className}
    aria-label={label ?? placeholder}
    value={value != null ? String(value) : ''}
    onChange={(v) => onChange(toNumber(v))}
    isDisabled={isDisabled}
    isInvalid={!!error}
  >
    {label && <Label>{label}</Label>}
    <Input type="number" min={min} placeholder={placeholder} />
    {description && <Description>{description}</Description>}
    <FieldError>{error}</FieldError>
  </TextField>
);

type TextInputProps = BaseProps & {
  value: string | undefined;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
};

export const TextInput = ({
  label,
  description,
  error,
  isDisabled,
  placeholder,
  className,
  value,
  onChange,
  multiline,
  rows = 3,
}: TextInputProps) => (
  <TextField
    fullWidth
    className={className}
    aria-label={label ?? placeholder}
    value={value ?? ''}
    onChange={onChange}
    isDisabled={isDisabled}
    isInvalid={!!error}
  >
    {label && <Label>{label}</Label>}
    {multiline ? (
      <TextArea rows={rows} placeholder={placeholder} />
    ) : (
      <Input placeholder={placeholder} />
    )}
    {description && <Description>{description}</Description>}
    <FieldError>{error}</FieldError>
  </TextField>
);

export const ErrorText = ({ children }: { children?: string }) =>
  children ? <p className="text-danger text-xs">{children}</p> : null;
