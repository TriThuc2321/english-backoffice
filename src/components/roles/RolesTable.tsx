import type { SortingState } from '@tanstack/react-table';

import { Button, Chip, Dropdown } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEllipsisVertical, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Role } from '@/types/role';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteRole } from '@/hooks/apis/roles';
import { PermissionAction, SubjectName } from '@/types/auth';
import { RoleStatus } from '@/types/role';
import { toSortDescriptor, toSortingState } from '@/utils/table';

const statusColorMap: Record<RoleStatus, 'success' | 'danger' | 'default'> = {
  [RoleStatus.ACTIVE]: 'success',
  [RoleStatus.INACTIVE]: 'danger',
  [RoleStatus.DELETED]: 'default',
};

const columnHelper = createColumnHelper<Role>();

type RoleActionsCellProps = {
  row: { original: Role };
  navigate: ReturnType<typeof useNavigate>;
  deleteRole: (ids: number[]) => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function RoleActionsCell({
  row,
  navigate,
  deleteRole,
  isDeleting,
  t,
}: RoleActionsCellProps) {
  const ability = useCan();

  const handleDelete = () => {
    deleteRole([row.original.id]);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Read}
          a={SubjectName.Roles}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/roles/${row.original.id}`)}
        >
          <LuEye className="size-4" />
        </MyButton>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Roles}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/roles/${row.original.id}/edit`)}
        >
          <LuPencil className="size-4" />
        </MyButton>
        <ConfirmWrapper
          title={t('roles.deleteTitle')}
          description={t('roles.deleteConfirm', { name: row.original.name })}
          onConfirm={handleDelete}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Roles}
            isIconOnly
            size="sm"
            variant="outline"
            isDisabled={isDeleting}
          >
            <LuTrash2 className="text-danger size-4" />
          </MyButton>
        </ConfirmWrapper>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Dropdown>
          <Dropdown.Trigger>
            <Button isIconOnly size="sm" variant="tertiary">
              <LuEllipsisVertical className="size-4" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="end top">
            <Dropdown.Menu aria-label={t('common.actions')}>
              {ability.can(PermissionAction.Read, SubjectName.Roles) && (
                <Dropdown.Item
                  id="view"
                  textValue={t('common.view')}
                  onPress={() => navigate(`/roles/${row.original.id}`)}
                >
                  <span className="flex items-center gap-2">
                    <LuEye className="size-4" />
                    {t('common.view')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Update, SubjectName.Roles) && (
                <Dropdown.Item
                  id="edit"
                  textValue={t('common.edit')}
                  onPress={() => navigate(`/roles/${row.original.id}/edit`)}
                >
                  <span className="flex items-center gap-2">
                    <LuPencil className="size-4" />
                    {t('common.edit')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Roles) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('roles.deleteTitle')}
                    description={t('roles.deleteConfirm', {
                      name: row.original.name,
                    })}
                    onConfirm={handleDelete}
                  >
                    <span className="flex items-center gap-2">
                      <LuTrash2 className="size-4" />
                      {t('common.delete')}
                    </span>
                  </ConfirmWrapper>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </>
  );
}

interface RolesTableProps {
  data: Role[];
  isLoading?: boolean;
  page?: number;
  take?: number;
  total?: number;
}

export default function RolesTable({
  data,
  isLoading,
  page,
  take,
  total,
}: RolesTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('roles.table.name'),
        enableSorting: false,
      }),
      columnHelper.accessor('code', {
        header: t('roles.table.code'),
        enableSorting: false,
      }),
      columnHelper.accessor('status', {
        header: t('roles.table.status'),
        enableSorting: false,
        cell: (info) => (
          <Chip
            color={statusColorMap[info.getValue()]}
            size="sm"
            variant="soft"
          >
            <Chip.Label>{info.getValue()}</Chip.Label>
          </Chip>
        ),
      }),
      columnHelper.accessor('canAccessCms', {
        header: t('roles.table.cmsAccess'),
        enableSorting: false,
        cell: (info) => (
          <Chip
            color={info.getValue() ? 'success' : 'default'}
            size="sm"
            variant="soft"
          >
            {info.getValue() ? t('common.yes') : t('common.no')}
          </Chip>
        ),
      }),
      columnHelper.accessor('auditMetadata', {
        id: 'createdBy',
        header: t('common.createdBy'),
        enableSorting: false,
        cell: (info) => {
          const audit = info.getValue();
          if (!audit?.createdBy && !audit?.createdAt) return '-';
          return (
            <AuditItem user={audit?.createdBy} dateTime={audit?.createdAt} />
          );
        },
      }),
      columnHelper.accessor('auditMetadata', {
        id: 'updatedBy',
        header: t('common.updatedBy'),
        enableSorting: false,
        cell: (info) => {
          const audit = info.getValue();
          if (!audit?.updatedBy && !audit?.updatedAt) return '-';
          return (
            <AuditItem user={audit?.updatedBy} dateTime={audit?.updatedAt} />
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <RoleActionsCell
            row={row}
            navigate={navigate}
            deleteRole={deleteRole}
            isDeleting={isDeleting}
            t={t}
          />
        ),
      }),
    ],
    [t, navigate, deleteRole, isDeleting],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
  });

  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);

  return (
    <TanstackTable
      table={table}
      sortDescriptor={sortDescriptor}
      onSortChange={(d) => setSorting(toSortingState(d))}
      ariaLabel="Roles table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
