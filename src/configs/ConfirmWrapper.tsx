import type { ButtonVariants } from '@heroui/styles';
import type { ComponentProps, ReactNode } from 'react';

import { Button, Popover } from '@heroui/react';
import { useState } from 'react';

import type { Placement } from '@/types/common';

type PopoverContentPlacement = NonNullable<
  ComponentProps<typeof Popover.Content>['placement']
>;

function toPopoverPlacement(placement: Placement): PopoverContentPlacement {
  return placement.replaceAll('-', ' ') as PopoverContentPlacement;
}

type ConfirmWrapperProps = {
  children: ReactNode;
  placement?: Placement;
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmVariant?: ButtonVariants['variant'];
  cancelVariant?: ButtonVariants['variant'];
  confirmText?: string;
  cancelText?: string;
};
export default function ConfirmWrapper({
  children,
  placement,
  title,
  description,
  onConfirm,
  onCancel,
  confirmVariant = 'danger',
  cancelVariant = 'tertiary',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const placementProp = placement ? toPopoverPlacement(placement) : 'bottom';

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content placement={placementProp}>
        <Popover.Dialog>
          <Popover.Heading>{title}</Popover.Heading>
          <div className="flex flex-col gap-2 px-1 py-2">
            {description ? (
              <p className="text-tiny text-muted">{description}</p>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant={cancelVariant}
                onPress={() => {
                  onCancel?.();
                  setIsOpen(false);
                }}
              >
                {cancelText}
              </Button>
              <Button
                size="sm"
                variant={confirmVariant}
                onPress={() => {
                  onConfirm?.();
                  setIsOpen(false);
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
