import type { ButtonProps } from '@heroui/react';

import { Button } from '@heroui/react';

import type { PermissionAction, SubjectName } from '@/types/auth';

import { Can } from '@/configs/casl/can.config';

type MyButtonProps = ButtonProps & {
  I?: PermissionAction;
  a?: SubjectName;
};
const MyButton = (props: MyButtonProps) => {
  const { I, a, ...rest } = props;

  const button = <Button {...rest} />;

  if (I && a)
    return (
      <Can I={I} a={a}>
        {button}
      </Can>
    );

  return button;
};

export default MyButton;
