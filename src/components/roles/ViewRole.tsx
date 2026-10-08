import { Button, Chip, Spinner } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCheck, LuPencil, LuX } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useGetPermissions } from '@/hooks/apis/permissions';
import { useGetRoleById } from '@/hooks/apis/roles';
import { PermissionAction, SubjectName } from '@/types/auth';
import { RoleStatus } from '@/types/role';

import type { GroupedPermissions, PermissionRow } from './PermissionSelector';

import Loader from '../shared/Loader';
import {
  ALL_RESOURCE_PERMISSIONS_KEY,
  groupPermission,
  sortActions,
} from './PermissionSelector';

type ViewRoleProps = {
  id: string;
};

const statusColorMap: Record<RoleStatus, 'success' | 'danger' | 'default'> = {
  [RoleStatus.ACTIVE]: 'success',
  [RoleStatus.INACTIVE]: 'danger',
  [RoleStatus.DELETED]: 'default',
};

const ViewRole = ({ id }: ViewRoleProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: role, isLoading } = useGetRoleById(id);
  const { data: allPermissions } = useGetPermissions();

  const { groups: permissionGroups, fullPermissionId } = useMemo(() => {
    const groups = groupPermission(allPermissions);
    const managePermission = groups[ALL_RESOURCE_PERMISSIONS_KEY];
    delete groups[ALL_RESOURCE_PERMISSIONS_KEY];
    return { groups, fullPermissionId: managePermission?.[0]?.id };
  }, [allPermissions]);

  const rolePermissionIds = useMemo(() => {
    if (!role || !allPermissions) return new Set<number>();
    const matched = allPermissions.filter((p) =>
      role.permissions.some(
        (rp) => rp.action === p.action && rp.subject === p.subject,
      ),
    );
    return new Set(matched.map((p) => p.id));
  }, [role, allPermissions]);

  if (isLoading) {
    return (
      <div className="flex h-90 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('roles.form.name')}>{role.name}</DetailField>
        <DetailField label={t('roles.form.code')}>
          <span className="text-sm">{role.code}</span>
        </DetailField>
        <DetailField label={t('roles.form.status')}>
          <Chip color={statusColorMap[role.status]} size="sm" variant="soft">
            <Chip.Label>{role.status}</Chip.Label>
          </Chip>
        </DetailField>
        <DetailField label={t('roles.form.canAccessCms')}>
          <Chip
            color={role.canAccessCms ? 'success' : 'default'}
            size="sm"
            variant="soft"
          >
            <Chip.Label>
              {role.canAccessCms ? t('common.yes') : t('common.no')}
            </Chip.Label>
          </Chip>
        </DetailField>
      </InfoCard>

      <InfoCard title={t('roles.form.permissions')} columns={1}>
        {!allPermissions ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <RolePermissionsTable
            permissionGroups={permissionGroups}
            rolePermissionIds={rolePermissionIds}
            fullPermissionId={fullPermissionId}
          />
        )}
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/roles')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Roles}
          variant="primary"
          isDisabled={role?.systemRole}
          onPress={() => navigate(`/roles/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

type RolePermissionsTableProps = {
  permissionGroups: GroupedPermissions;
  rolePermissionIds: Set<number>;
  fullPermissionId?: number;
};

const columnHelper = createColumnHelper<PermissionRow>();

const RolePermissionsTable = ({
  permissionGroups,
  rolePermissionIds,
  fullPermissionId,
}: RolePermissionsTableProps) => {
  const { t } = useTranslation();
  const hasFullPermission =
    fullPermissionId != null && rolePermissionIds.has(fullPermissionId);

  const rows = useMemo<PermissionRow[]>(
    () =>
      Object.entries(permissionGroups)
        .filter(
          ([, permissions]) =>
            hasFullPermission ||
            permissions.some((p) => rolePermissionIds.has(p.id)),
        )
        .map(([subject, permissions]) => ({
          subject,
          permissions,
          byAction: Object.fromEntries(permissions.map((p) => [p.action, p])),
        })),
    [permissionGroups, rolePermissionIds, hasFullPermission],
  );

  const actions = useMemo(() => sortActions(rows), [rows]);

  // `manage` on a subject (or the global full permission) implies every action
  const isGranted = (row: PermissionRow, id: number) => {
    const manageId = row.byAction[PermissionAction.Manage]?.id;
    return (
      hasFullPermission ||
      rolePermissionIds.has(id) ||
      (manageId != null && rolePermissionIds.has(manageId))
    );
  };

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
    ...actions.map((action) =>
      columnHelper.display({
        id: `action-${action}`,
        header: () => <span className="capitalize">{action}</span>,
        cell: ({ row }) => {
          const permission = row.original.byAction[action];
          if (!permission) return <span className="text-muted">—</span>;

          return isGranted(row.original, permission.id) ? (
            <LuCheck
              aria-label={`${action} granted`}
              className="text-success size-4"
            />
          ) : (
            <LuX
              aria-label={`${action} not granted`}
              className="text-muted size-4"
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
        const grantedCount = permissions.filter((p) =>
          isGranted(row.original, p.id),
        ).length;

        return (
          <Chip size="sm" variant="soft">
            <Chip.Label>
              {grantedCount}/{permissions.length}
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
      {hasFullPermission && (
        <Chip size="sm" variant="soft" color="success" className="self-start">
          <Chip.Label>{t('roles.form.fullPermissions')}</Chip.Label>
        </Chip>
      )}

      <TanstackTable
        table={table}
        ariaLabel={t('roles.form.permissions')}
        maxHeight="none"
      />
    </div>
  );
};

export default ViewRole;
