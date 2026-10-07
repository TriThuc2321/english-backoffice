import { Button, Dropdown } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEllipsisVertical, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Campus } from '@/types/campus';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteCampus } from '@/hooks/apis/campuses';
import { PermissionAction, SubjectName } from '@/types/auth';

const columnHelper = createColumnHelper<Campus>();

type CampusActionsCellProps = {
  row: { original: Campus };
  navigate: ReturnType<typeof useNavigate>;
  deleteCampus: (ids: string[]) => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function CampusActionsCell({
  row,
  navigate,
  deleteCampus,
  isDeleting,
  t,
}: CampusActionsCellProps) {
  const ability = useCan();

  const handleDelete = () => {
    deleteCampus([row.original.id]);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Read}
          a={SubjectName.Campuses}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/campuses/${row.original.id}`)}
        >
          <LuEye className="size-4" />
        </MyButton>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Campuses}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/campuses/${row.original.id}/edit`)}
        >
          <LuPencil className="size-4" />
        </MyButton>
        <ConfirmWrapper
          title={t('campuses.deleteTitle')}
          description={t('campuses.deleteConfirm', { name: row.original.code })}
          onConfirm={handleDelete}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Campuses}
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
          <Dropdown.Popover placement="left">
            <Dropdown.Menu aria-label={t('common.actions')}>
              {ability.can(PermissionAction.Read, SubjectName.Campuses) && (
                <Dropdown.Item
                  id="view"
                  textValue={t('common.view')}
                  onPress={() => navigate(`/campuses/${row.original.id}`)}
                >
                  <span className="flex items-center gap-2">
                    <LuEye className="size-4" />
                    {t('common.view')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Update, SubjectName.Campuses) && (
                <Dropdown.Item
                  id="edit"
                  textValue={t('common.edit')}
                  onPress={() => navigate(`/campuses/${row.original.id}/edit`)}
                >
                  <span className="flex items-center gap-2">
                    <LuPencil className="size-4" />
                    {t('common.edit')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Campuses) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('campuses.deleteTitle')}
                    description={t('campuses.deleteConfirm', {
                      name: row.original.code,
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

interface CampusesTableProps {
  data: Campus[];
  isLoading?: boolean;
  page?: number;
  take?: number;
  total?: number;
}

export default function CampusesTable({
  data,
  isLoading,
  page,
  take,
  total,
}: CampusesTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteCampus, isPending: isDeleting } = useDeleteCampus();

  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        enableSorting: false,
        header: t('campuses.table.code'),
      }),
      columnHelper.accessor('name', {
        enableSorting: false,
        header: t('campuses.table.name'),
      }),
      columnHelper.accessor('address', {
        enableSorting: false,
        header: t('campuses.table.address'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('phone', {
        enableSorting: false,
        header: t('campuses.table.phone'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('auditMetadata', {
        enableSorting: false,
        id: 'createdBy',
        header: t('common.createdBy'),
        cell: (info) => {
          const audit = info.getValue();
          if (!audit?.createdBy && !audit?.createdAt) return '-';
          return (
            <AuditItem user={audit?.createdBy} dateTime={audit?.createdAt} />
          );
        },
      }),
      columnHelper.accessor('auditMetadata', {
        enableSorting: false,
        id: 'updatedBy',
        header: t('common.updatedBy'),
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
          <CampusActionsCell
            row={row}
            navigate={navigate}
            deleteCampus={deleteCampus}
            isDeleting={isDeleting}
            t={t}
          />
        ),
      }),
    ],
    [t, navigate, deleteCampus, isDeleting],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
  });

  return (
    <TanstackTable
      table={table}
      ariaLabel="Campuses table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
