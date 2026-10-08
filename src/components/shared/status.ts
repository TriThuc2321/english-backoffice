import type { TFunction } from 'i18next';

import { Status } from '@/types/common';

export const statusColorMap: Record<Status, 'success' | 'danger' | 'default'> =
  {
    [Status.ACTIVE]: 'success',
    [Status.INACTIVE]: 'danger',
    [Status.DELETED]: 'default',
  };

export const getStatusLabel = (t: TFunction, status: Status) =>
  ({
    [Status.ACTIVE]: t('common.active'),
    [Status.INACTIVE]: t('common.inactive'),
    [Status.DELETED]: t('common.deleted'),
  })[status] ?? status;

export const getEditableStatusItems = (t: TFunction) => [
  { label: t('common.active'), value: Status.ACTIVE },
  { label: t('common.inactive'), value: Status.INACTIVE },
];
