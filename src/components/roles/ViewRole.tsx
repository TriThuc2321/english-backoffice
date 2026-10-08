import { Button, Chip, Spinner, toast } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LuArrowLeft,
  LuCheck,
  LuCopy,
  LuMinus,
  LuPencil,
} from 'react-icons/lu';
import { useNavigate } from 'react-router';

import AuditItem from '@/components/shared/AuditItem';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { getStatusLabel, statusColorMap } from '@/components/shared/status';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { Can } from '@/configs/casl/can.config';
import { useGetPermissions } from '@/hooks/apis/permissions';
import { useGetRoleById } from '@/hooks/apis/roles';
import { PermissionAction, SubjectName } from '@/types/auth';

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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(role.code);
      toast.success(t('common.copied'));
    } catch {
      // Clipboard can be blocked (insecure context / permissions)
    }
  };

  const audit = role.auditMetadata;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="truncate text-xl font-semibold">{role.name}</h2>
            <div className="text-muted flex items-center gap-1">
              <span className="truncate font-mono text-sm">{role.code}</span>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={t('common.copy')}
                className="size-6 min-w-6"
                onPress={copyCode}
              >
                <LuCopy className="size-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={statusColorMap[role.status]} size="sm" variant="soft">
              <Chip.Label>{getStatusLabel(t, role.status)}</Chip.Label>
            </Chip>
            <Chip
              color={role.canAccessCms ? 'success' : 'default'}
              size="sm"
              variant="soft"
            >
              <Chip.Label>
                {t('roles.table.cmsAccess')}:{' '}
                {role.canAccessCms ? t('common.yes') : t('common.no')}
              </Chip.Label>
            </Chip>
            {role.systemRole && (
              <Chip color="accent" size="sm" variant="soft">
                <Chip.Label>{t('roles.system')}</Chip.Label>
              </Chip>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => navigate('/roles')}
          >
            <LuArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
          <Can I={PermissionAction.Update} a={SubjectName.Roles}>
            <Button
              size="sm"
              variant="primary"
              isDisabled={role.systemRole}
              onPress={() => navigate(`/roles/${id}/edit`)}
            >
              <LuPencil className="size-4" />
              {t('common.edit')}
            </Button>
          </Can>
        </div>
      </header>

      {!allPermissions ? (
        <InfoCard title={t('roles.form.permissions')} columns={1}>
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        </InfoCard>
      ) : (
        <RolePermissionsTable
          permissionGroups={permissionGroups}
          rolePermissionIds={rolePermissionIds}
          fullPermissionId={fullPermissionId}
        />
      )}

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          {audit?.createdBy || audit?.createdAt ? (
            <AuditItem user={audit.createdBy} dateTime={audit.createdAt} />
          ) : (
            '-'
          )}
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          {audit?.updatedBy || audit?.updatedAt ? (
            <AuditItem user={audit.updatedBy} dateTime={audit.updatedAt} />
          ) : (
            '-'
          )}
        </DetailField>
      </InfoCard>
    </div>
  );
};

type RolePermissionsTableProps = {
  permissionGroups: GroupedPermissions;
  rolePermissionIds: Set<number>;
  fullPermissionId?: number;
};

type RolePermissionRow = PermissionRow & {
  granted: number;
  total: number;
};

const columnHelper = createColumnHelper<RolePermissionRow>();

const RolePermissionsTable = ({
  permissionGroups,
  rolePermissionIds,
  fullPermissionId,
}: RolePermissionsTableProps) => {
  const { t } = useTranslation();
  const hasFullPermission =
    fullPermissionId != null && rolePermissionIds.has(fullPermissionId);

  // `manage` on a subject (or the global full permission) implies every action
  const isGranted = useCallback(
    (row: PermissionRow, id: number) => {
      const manageId = row.byAction[PermissionAction.Manage]?.id;
      return (
        hasFullPermission ||
        rolePermissionIds.has(id) ||
        (manageId != null && rolePermissionIds.has(manageId))
      );
    },
    [hasFullPermission, rolePermissionIds],
  );

  // Memoized so the table gets stable `data`/`columns`; rebuilding them on
  // every render makes the React Aria table loop forever on a POP navigation
  const rows = useMemo<RolePermissionRow[]>(
    () =>
      Object.entries(permissionGroups)
        .filter(
          ([, permissions]) =>
            hasFullPermission ||
            permissions.some((p) => rolePermissionIds.has(p.id)),
        )
        .map(([subject, permissions]) => {
          const row: PermissionRow = {
            subject,
            permissions,
            byAction: Object.fromEntries(permissions.map((p) => [p.action, p])),
          };
          const actionable = permissions.filter(
            (p) => p.action !== PermissionAction.Manage,
          );
          return {
            ...row,
            total: actionable.length,
            granted: actionable.filter((p) => isGranted(row, p.id)).length,
          };
        }),
    [permissionGroups, rolePermissionIds, hasFullPermission, isGranted],
  );

  const totalGranted = rows.reduce((sum, row) => sum + row.granted, 0);
  const actions = useMemo(() => sortActions(rows), [rows]);

  const columns = useMemo(
    () => [
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
          header: () => (
            <span className="w-full text-center capitalize">{action}</span>
          ),
          cell: ({ row }) => {
            const permission = row.original.byAction[action];

            return (
              <div className="flex min-w-20 justify-center">
                {!permission ? (
                  <span className="text-muted/40">—</span>
                ) : isGranted(row.original, permission.id) ? (
                  <LuCheck
                    aria-label={`${action} granted`}
                    className="text-success size-4"
                  />
                ) : (
                  <LuMinus
                    aria-label={`${action} not granted`}
                    className="text-muted/40 size-4"
                  />
                )}
              </div>
            );
          },
        }),
      ),
      columnHelper.display({
        id: 'count',
        header: () => (
          <span className="w-full text-right">{t('roles.form.granted')}</span>
        ),
        cell: ({ row }) => {
          const { granted, total } = row.original;
          const isFull = granted === total;

          return (
            <div className="flex justify-end">
              <Chip
                size="sm"
                variant="soft"
                color={isFull ? 'success' : 'default'}
              >
                <Chip.Label>
                  {isFull ? t('roles.form.full') : `${granted}/${total}`}
                </Chip.Label>
              </Chip>
            </div>
          );
        },
      }),
    ],
    [actions, isGranted, t],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getRowId: (row) => row.subject,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <InfoCard
      title={t('roles.form.permissions')}
      description={t('roles.permissionSummary', {
        resources: rows.length,
        granted: totalGranted,
      })}
      actions={
        hasFullPermission && (
          <Chip size="sm" variant="soft" color="success">
            <Chip.Label>{t('roles.form.fullPermissions')}</Chip.Label>
          </Chip>
        )
      }
      columns={1}
    >
      <div className="min-w-0">
        <TanstackTable
          table={table}
          ariaLabel={t('roles.form.permissions')}
          maxHeight="none"
        />
      </div>
    </InfoCard>
  );
};

export default ViewRole;
