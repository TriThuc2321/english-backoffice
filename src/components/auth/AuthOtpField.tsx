import {
  ErrorMessage,
  InputOTP,
  Label,
  REGEXP_ONLY_DIGITS,
} from '@heroui/react';
import { useId } from 'react';
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';

type AuthOtpFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  length?: number;
  labelAside?: React.ReactNode;
};

export default function AuthOtpField<T extends FieldValues>({
  control,
  name,
  label,
  length = 6,
  labelAside,
}: AuthOtpFieldProps<T>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={id}>{label}</Label>
            {labelAside}
          </div>
          <InputOTP
            ref={field.ref}
            id={id}
            name={field.name}
            maxLength={length}
            pattern={REGEXP_ONLY_DIGITS}
            autoComplete="one-time-code"
            inputMode="numeric"
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isInvalid={!!error}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className="justify-center"
          >
            <InputOTP.Group>
              {Array.from({ length }, (_, index) => (
                <InputOTP.Slot key={index} index={index} />
              ))}
            </InputOTP.Group>
          </InputOTP>
          {error?.message && (
            <ErrorMessage id={errorId}>{error.message}</ErrorMessage>
          )}
        </div>
      )}
    />
  );
}
