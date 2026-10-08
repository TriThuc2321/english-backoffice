import type { Control } from 'react-hook-form';

import { Checkbox, Chip, Label, Spinner } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateEditRoleFormData } from '@/schemas/role';
import type { Permission } from '@/types/permission';

import TanstackTable from '@/components/shared/table/TanstackTable';
import { useGetPermissions } from '@/hooks/apis/permissions';
import { PermissionAction } from '@/types/auth';

export const ALL_RESOURCE_PERMISSIONS_KEY = 'all';

type PermissionSelectorProps = {
  control: Control<CreateEditRoleFormData>;
};

export type GroupedPermissions = Record<string, Permission[]>;

const PermissionSelector = ({ control }: PermissionSelectorProps) => {
  const { data: permissions, isLoading } = useGetPermissions();

  const { groups: permissionGroups, fullPermissionId } = useMemo(() => {
    if (!permissions) {
      return { groups: {} as GroupedPermissions, fullPermissionId: undefined };
    }

    const groups = groupPermission(permissions);
    const managePermission = groups[ALL_RESOURCE_PERMISSIONS_KEY];
    delete groups[ALL_RESOURCE_PERMISSIONS_KEY];

    return {
      groups: groups as GroupedPermissions,
      fullPermissionId: managePermission ? managePermission[0].id : undefined,
    };
  }, [permissions]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <Controller
      name="permissionIds"
      control={control}
      render={({ field }) => (
        <PermissionSelectorContent
          value={field.value}
          onChange={field.onChange}
          permissionGroups={permissionGroups}
          fullPermissionId={fullPermissionId}
        />
      )}
    />
  );
};

type PermissionSelectorContentProps = {
  value?: number[];
  onChange: (value: number[]) => void;
  permissionGroups: GroupedPermissions;
  fullPermissionId?: number;
};

export type PermissionRow = {
  subject: string;
  permissions: Permission[];
  byAction: Record<string, Permission | undefined>;
};

const columnHelper = createColumnHelper<PermissionRow>();

const PermissionSelectorContent = ({
  value,
  onChange,
  permissionGroups,
  fullPermissionId,
}: PermissionSelectorContentProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number[]>(value || []);
  const [isDisableAll, setDisableAll] = useState<boolean>(false);

  const rows = useMemo<PermissionRow[]>(
    () =>
      Object.entries(permissionGroups).map(([subject, permissions]) => ({
        subject,
        permissions,
        byAction: Object.fromEntries(permissions.map((p) => [p.action, p])),
      })),
    [permissionGroups],
  );

  const actions = useMemo(() => sortActions(rows), [rows]);

  const updateSelected = (newSelected: number[]) => {
    setSelected(newSelected);
    onChange(newSelected);
  };

  const subjectActions = useMemo(
    () =>
      rows.map((row) => ({
        manageId: row.byAction[PermissionAction.Manage]?.id,
        actionIds: row.permissions
          .filter((p) => p.action !== PermissionAction.Manage)
          .map((p) => p.id),
      })),
    [rows],
  );

  const expand = (ids: number[]) => {
    const result = new Set(ids);
    subjectActions.forEach(({ manageId, actionIds }) => {
      if (manageId == null || !result.has(manageId)) return;
      result.delete(manageId);
      actionIds.forEach((id) => result.add(id));
    });
    return result;
  };

  const compress = (ids: Set<number>) => {
    const result = new Set(ids);
    subjectActions.forEach(({ manageId, actionIds }) => {
      if (manageId == null || actionIds.length === 0) return;
      if (!actionIds.every((id) => result.has(id))) return;
      actionIds.forEach((id) => result.delete(id));
      result.add(manageId);
    });
    return [...result];
  };

  const effective = useMemo(() => expand(selected), [selected, subjectActions]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleIds = (ids: number[], isSelected: boolean) => {
    const next = expand(selected);
    ids.forEach((id) => (isSelected ? next.add(id) : next.delete(id)));
    updateSelected(compress(next));
  };

  const handleSelectAll = (isSelected: boolean, id: number) => {
    updateSelected(isSelected ? [id] : []);
    setDisableAll(isSelected);
  };

  useEffect(() => {
    setSelected(value || []);
    const isFullPermission = fullPermissionId
      ? (value?.includes(fullPermissionId) ?? false)
      : false;
    setDisableAll(isFullPermission);
  }, [value, fullPermissionId]);

  const isChecked = (id: number) => effective.has(id);

  const columns = [
    columnHelper.display({
      id: 'subject',
      header: () => t('roles.form.subject'),
      cell: ({ row }) => (
        <span className="text-sm font-medium capitalize">
          {row.original.subject.replaceAll('_', ' ')}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'all',
      header: () => t('roles.form.all'),
      cell: ({ row }) => {
        const { subject, permissions } = row.original;
        const ids = permissions
          .filter((p) => p.action !== PermissionAction.Manage)
          .map((p) => p.id);
        const checkedCount = ids.filter(isChecked).length;

        return (
          <PermissionCheckbox
            ariaLabel={`Select all ${subject.replaceAll('_', ' ')}`}
            isSelected={ids.length > 0 && checkedCount === ids.length}
            isIndeterminate={checkedCount > 0 && checkedCount < ids.length}
            isDisabled={isDisableAll || ids.length === 0}
            onChange={(isSelected) => toggleIds(ids, isSelected)}
          />
        );
      },
    }),
    ...actions.map((action) =>
      columnHelper.display({
        id: `action-${action}`,
        header: () => {
          const ids = rows
            .map((r) => r.byAction[action]?.id)
            .filter((id): id is number => id != null);
          const checkedCount = ids.filter(isChecked).length;

          return (
            <span className="flex items-center gap-2">
              <PermissionCheckbox
                ariaLabel={`Select all ${action}`}
                isSelected={ids.length > 0 && checkedCount === ids.length}
                isIndeterminate={checkedCount > 0 && checkedCount < ids.length}
                isDisabled={isDisableAll || ids.length === 0}
                onChange={(isSelected) => toggleIds(ids, isSelected)}
              />
              <span className="capitalize">{action}</span>
            </span>
          );
        },
        cell: ({ row }) => {
          const permission = row.original.byAction[action];
          if (!permission) return <span className="text-muted">—</span>;

          return (
            <PermissionCheckbox
              ariaLabel={`${action} ${row.original.subject.replaceAll('_', ' ')}`}
              isSelected={isChecked(permission.id)}
              isDisabled={isDisableAll}
              onChange={(isSelected) => toggleIds([permission.id], isSelected)}
            />
          );
        },
      }),
    ),
    columnHelper.display({
      id: 'count',
      header: '',
      cell: ({ row }) => {
        const permissions = row.original.permissions.filter(
          (p) => p.action !== PermissionAction.Manage,
        );
        const checkedCount = permissions.filter((p) => isChecked(p.id)).length;

        return (
          <Chip size="sm" variant="soft">
            <Chip.Label>
              {checkedCount}/{permissions.length}
            </Chip.Label>
          </Chip>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getRowId: (row) => row.subject,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {fullPermissionId != null && (
        <Checkbox
          id={`full-permissions-${fullPermissionId}`}
          className="py-2.5"
          isSelected={isDisableAll}
          onChange={(isSelected) =>
            handleSelectAll(isSelected, fullPermissionId)
          }
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label
              htmlFor={`full-permissions-${fullPermissionId}`}
              className="text-sm font-medium capitalize"
            >
              {t('roles.form.fullPermissions')}
            </Label>
          </Checkbox.Content>
        </Checkbox>
      )}

      <TanstackTable
        table={table}
        ariaLabel={t('roles.form.permissions')}
        maxHeight="none"
      />
    </div>
  );
};

type PermissionCheckboxProps = {
  ariaLabel: string;
  isSelected: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onChange: (isSelected: boolean) => void;
};

const PermissionCheckbox = ({
  ariaLabel,
  isSelected,
  isIndeterminate,
  isDisabled,
  onChange,
}: PermissionCheckboxProps) => (
  <Checkbox
    slot={null}
    aria-label={ariaLabel}
    isSelected={isSelected}
    isIndeterminate={isIndeterminate}
    isDisabled={isDisabled}
    onChange={onChange}
  >
    <Checkbox.Control>
      <Checkbox.Indicator />
    </Checkbox.Control>
  </Checkbox>
);

const ACTION_ORDER: string[] = [
  PermissionAction.Create,
  PermissionAction.Read,
  PermissionAction.Update,
  PermissionAction.Delete,
];

export const sortActions = (rows: PermissionRow[]) => {
  const actions = new Set<string>();
  rows.forEach((row) => row.permissions.forEach((p) => actions.add(p.action)));
  actions.delete(PermissionAction.Manage);

  const rank = (action: string) => {
    const index = ACTION_ORDER.indexOf(action);
    return index === -1 ? ACTION_ORDER.length : index;
  };

  return [...actions].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
};

export const groupPermission = (permissions?: Permission[]) => {
  if (!permissions) return {};

  return permissions.reduce((acc, permission) => {
    const { subject } = permission;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(permission);
    return acc;
  }, {} as GroupedPermissions);
};

export default PermissionSelector;
