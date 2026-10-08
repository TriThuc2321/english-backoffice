import { Avatar } from '@heroui/react';

import type { User } from '@/types/user';

import { formatDateTime } from '@/utils/datetime';

import RenderIf from './RenderIf';

type AuditItemProps = Partial<{
  user?: User;
  dateTime: string;
}>;

export default function AuditItem({ user, dateTime }: AuditItemProps) {
  const { firstName, lastName, email, avatar } = user ?? {};
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const displayName = fullName || email || '';
  const initials = (
    (firstName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? '') ||
    displayName.charAt(0)
  ).toUpperCase();

  return (
    <div className="flex min-w-max items-center gap-3">
      <RenderIf condition={!!user}>
        <Avatar
          className="shrink-0 rounded-2xl"
          size="sm"
          variant="soft"
          color="accent"
        >
          <Avatar.Image alt={displayName} src={avatar} />
          <Avatar.Fallback className="rounded-2xl">{initials}</Avatar.Fallback>
        </Avatar>
      </RenderIf>
      <div className="flex flex-col">
        <p className="text-left text-sm">{displayName}</p>
        <p className="text-left text-xs">
          {formatDateTime(dateTime, 'MM/DD/YYYY HH:mm')}
        </p>
      </div>
    </div>
  );
}
