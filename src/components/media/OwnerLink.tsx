import { Link } from 'react-router';

import type { Nullable } from '@/types/common';
import type { MediaScope } from '@/types/media';

import { ownerHref } from './constants';

type OwnerLinkProps = {
  scope: MediaScope;
  ownerId: Nullable<string>;
  className?: string;
};

const OwnerLink = ({
  scope,
  ownerId,
  className = 'text-accent break-all hover:underline',
}: OwnerLinkProps) => {
  if (!ownerId) return '-';
  const href = ownerHref(scope, ownerId);
  if (!href) return <span className="break-all">{ownerId}</span>;
  return (
    <Link to={href} className={className}>
      {ownerId}
    </Link>
  );
};

export default OwnerLink;
