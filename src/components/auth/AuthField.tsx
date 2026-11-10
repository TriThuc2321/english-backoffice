import { FieldError, Input, Label, TextField } from '@heroui/react';
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';

type AuthFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: 'email' | 'password' | 'text';
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  labelAside?: React.ReactNode;
};

export default function AuthField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  autoComplete,
  inputMode,
  labelAside,
}: AuthFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          name={field.name}
          type={type}
          autoComplete={autoComplete}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={!!error}
          validationBehavior="aria"
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <Label>{label}</Label>
            {labelAside}
          </div>
          <Input
            ref={field.ref}
            inputMode={inputMode}
            className="h-11 text-base"
          />
          <FieldError>{error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}
