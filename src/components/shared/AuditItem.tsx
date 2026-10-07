import { Avatar } from '@heroui/react';

import type { User } from '@/types/user';

import { formatDateTime } from '@/utils/datetime';

import RenderIf from './RenderIf';

type AuditItemProps = Partial<{
  user?: User;
  dateTime: string;
}>;

export default function AuditItem({ user, dateTime }: AuditItemProps) {
  const { firstName, lastName, avatar } = user ?? {};
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  return (
    <div className="flex min-w-max items-center gap-3">
      <RenderIf condition={!!avatar && !!fullName}>
        <Avatar className="rounded-2xl" size="sm" variant="soft" color="accent">
          <Avatar.Image alt={fullName} src={avatar} />
          <Avatar.Fallback className="rounded-2xl">
            {fullName?.charAt(0) ?? ''}
          </Avatar.Fallback>
        </Avatar>
      </RenderIf>
      <div className="flex flex-col">
        <p className="text-left text-sm">{fullName}</p>
        <p className="text-left text-xs">
          {formatDateTime(dateTime, 'MM/DD/YYYY HH:mm')}
        </p>
      </div>
    </div>
  );
}
