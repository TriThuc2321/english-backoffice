import type { Control } from 'react-hook-form';

import { Checkbox, Chip, Label, Spinner } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { memo, useCallback, useMemo, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type {
  CreateEditRoleFormData,
  CreateEditRoleFormInput,
} from '@/schemas/role';
import type { Permission } from '@/types/permission';

import TanstackTable from '@/components/shared/table/TanstackTable';
import { useGetPermissions } from '@/hooks/apis/permissions';
import { PermissionAction } from '@/types/auth';

export const ALL_RESOURCE_PERMISSIONS_KEY = 'all';

type PermissionSelectorProps = {
  control: Control<CreateEditRoleFormInput, unknown, CreateEditRoleFormData>;
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
  const selected = useMemo(() => value ?? [], [value]);
  const isDisableAll =
    fullPermissionId != null && selected.includes(fullPermissionId);

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

  // Precomputed, referentially stable id lists so memoized checkboxes can skip re-renders
  const subjectActions = useMemo(
    () =>
      new Map(
        rows.map((row) => [
          row.subject,
          {
            manageId: row.byAction[PermissionAction.Manage]?.id,
            actionIds: row.permissions
              .filter((p) => p.action !== PermissionAction.Manage)
              .map((p) => p.id),
            singleIds: Object.fromEntries(
              row.permissions.map((p) => [p.action, [p.id]]),
            ) as Record<string, number[]>,
          },
        ]),
      ),
    [rows],
  );

  const actionColumnIds = useMemo(
    () =>
      Object.fromEntries(
        actions.map((action) => [
          action,
          rows
            .map((r) => r.byAction[action]?.id)
            .filter((id): id is number => id != null),
        ]),
      ) as Record<string, number[]>,
    [actions, rows],
  );

  const expand = useCallback(
    (ids: number[]) => {
      const result = new Set(ids);
      subjectActions.forEach(({ manageId, actionIds }) => {
        if (manageId == null || !result.has(manageId)) return;
        result.delete(manageId);
        actionIds.forEach((id) => result.add(id));
      });
      return result;
    },
    [subjectActions],
  );

  const compress = useCallback(
    (ids: Set<number>) => {
      const result = new Set(ids);
      subjectActions.forEach(({ manageId, actionIds }) => {
        if (manageId == null || actionIds.length === 0) return;
        if (!actionIds.every((id) => result.has(id))) return;
        actionIds.forEach((id) => result.delete(id));
        result.add(manageId);
      });
      return [...result];
    },
    [subjectActions],
  );

  const effective = useMemo(() => expand(selected), [expand, selected]);

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const toggleIds = useCallback(
    (ids: number[], isSelected: boolean) => {
      const next = expand(selectedRef.current);
      ids.forEach((id) => (isSelected ? next.add(id) : next.delete(id)));
      onChange(compress(next));
    },
    [expand, compress, onChange],
  );

  // Granular selection stashed while "Full permissions" is on, restored when it is turned off
  const beforeFullRef = useRef<number[] | null>(null);

  const handleSelectAll = (isSelected: boolean, id: number) => {
    if (isSelected) {
      beforeFullRef.current = selected.filter((s) => s !== id);
      onChange([id]);
      return;
    }
    onChange(beforeFullRef.current ?? selected.filter((s) => s !== id));
    beforeFullRef.current = null;
  };

  const countChecked = (ids: number[]) =>
    ids.reduce((count, id) => count + (effective.has(id) ? 1 : 0), 0);

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
        const { subject } = row.original;
        const ids = subjectActions.get(subject)!.actionIds;
        const checkedCount = countChecked(ids);

        return (
          <PermissionCheckbox
            ariaLabel={t('roles.form.selectAllFor', {
              name: subject.replaceAll('_', ' '),
            })}
            ids={ids}
            isSelected={ids.length > 0 && checkedCount === ids.length}
            isIndeterminate={checkedCount > 0 && checkedCount < ids.length}
            isDisabled={isDisableAll || ids.length === 0}
            onToggle={toggleIds}
          />
        );
      },
    }),
    ...actions.map((action) =>
      columnHelper.display({
        id: `action-${action}`,
        header: () => {
          const ids = actionColumnIds[action];
          const checkedCount = countChecked(ids);

          return (
            <span className="flex items-center gap-2">
              <PermissionCheckbox
                ariaLabel={t('roles.form.selectAllFor', { name: action })}
                ids={ids}
                isSelected={ids.length > 0 && checkedCount === ids.length}
                isIndeterminate={checkedCount > 0 && checkedCount < ids.length}
                isDisabled={isDisableAll || ids.length === 0}
                onToggle={toggleIds}
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
              ariaLabel={t('roles.form.permissionFor', {
                action,
                subject: row.original.subject.replaceAll('_', ' '),
              })}
              ids={subjectActions.get(row.original.subject)!.singleIds[action]}
              isSelected={effective.has(permission.id)}
              isDisabled={isDisableAll}
              onToggle={toggleIds}
            />
          );
        },
      }),
    ),
    columnHelper.display({
      id: 'count',
      header: '',
      cell: ({ row }) => {
        const ids = subjectActions.get(row.original.subject)!.actionIds;

        return (
          <Chip size="sm" variant="soft">
            <Chip.Label>
              {countChecked(ids)}/{ids.length}
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
  ids: number[];
  isSelected: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onToggle: (ids: number[], isSelected: boolean) => void;
};

const PermissionCheckbox = memo(
  ({
    ariaLabel,
    ids,
    isSelected,
    isIndeterminate,
    isDisabled,
    onToggle,
  }: PermissionCheckboxProps) => (
    <Checkbox
      slot={null}
      aria-label={ariaLabel}
      isSelected={isSelected}
      isIndeterminate={isIndeterminate}
      isDisabled={isDisabled}
      onChange={(checked) => onToggle(ids, checked)}
    >
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
    </Checkbox>
  ),
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
