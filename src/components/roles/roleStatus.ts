import type { TFunction } from 'i18next';

import { RoleStatus } from '@/types/role';

export const roleStatusColorMap: Record<
  RoleStatus,
  'success' | 'danger' | 'default'
> = {
  [RoleStatus.ACTIVE]: 'success',
  [RoleStatus.INACTIVE]: 'danger',
  [RoleStatus.DELETED]: 'default',
};

export const getRoleStatusLabel = (t: TFunction, status: RoleStatus) =>
  ({
    [RoleStatus.ACTIVE]: t('common.active'),
    [RoleStatus.INACTIVE]: t('common.inactive'),
    [RoleStatus.DELETED]: t('roles.status.deleted'),
  })[status] ?? status;
