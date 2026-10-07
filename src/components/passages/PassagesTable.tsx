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

import type { Passage } from '@/types/passage';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeletePassage } from '@/hooks/apis/passages';
import { PermissionAction, SubjectName } from '@/types/auth';
import { toSortDescriptor, toSortingState } from '@/utils/table';

import { statusColorMap } from './constants';

const columnHelper = createColumnHelper<Passage>();

type PassageActionsCellProps = {
  row: { original: Passage };
  navigate: ReturnType<typeof useNavigate>;
  deletePassage: (ids: string[]) => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function PassageActionsCell({
  row,
  navigate,
  deletePassage,
  isDeleting,
  t,
}: PassageActionsCellProps) {
  const ability = useCan();

  const handleDelete = () => {
    deletePassage([row.original.id]);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Read}
          a={SubjectName.Passages}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/passages/${row.original.id}`)}
        >
          <LuEye className="size-4" />
        </MyButton>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Passages}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/passages/${row.original.id}/edit`)}
        >
          <LuPencil className="size-4" />
        </MyButton>
        <ConfirmWrapper
          title={t('passages.deleteTitle')}
          description={t('passages.deleteConfirm', {
            name: row.original.title,
          })}
          onConfirm={handleDelete}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Passages}
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
              {ability.can(PermissionAction.Read, SubjectName.Passages) && (
                <Dropdown.Item
                  id="view"
                  textValue={t('common.view')}
                  onPress={() => navigate(`/passages/${row.original.id}`)}
                >
                  <span className="flex items-center gap-2">
                    <LuEye className="size-4" />
                    {t('common.view')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Update, SubjectName.Passages) && (
                <Dropdown.Item
                  id="edit"
                  textValue={t('common.edit')}
                  onPress={() => navigate(`/passages/${row.original.id}/edit`)}
                >
                  <span className="flex items-center gap-2">
                    <LuPencil className="size-4" />
                    {t('common.edit')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Passages) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('passages.deleteTitle')}
                    description={t('passages.deleteConfirm', {
                      name: row.original.title,
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

interface PassagesTableProps {
  data: Passage[];
  isLoading?: boolean;
  page?: number;
  take?: number;
  total?: number;
}

export default function PassagesTable({
  data,
  isLoading,
  page,
  take,
  total,
}: PassagesTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deletePassage, isPending: isDeleting } = useDeletePassage();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        enableSorting: false,
        header: t('passages.table.title'),
      }),
      columnHelper.accessor('markedBy', {
        enableSorting: false,
        header: t('passages.table.markedBy'),
      }),
      columnHelper.accessor('status', {
        enableSorting: false,
        header: t('passages.table.status'),
        cell: (info) => {
          const value = info.getValue();
          if (!value) return '-';
          return (
            <Chip color={statusColorMap[value]} size="sm" variant="soft">
              <Chip.Label>{value}</Chip.Label>
            </Chip>
          );
        },
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
          <PassageActionsCell
            row={row}
            navigate={navigate}
            deletePassage={deletePassage}
            isDeleting={isDeleting}
            t={t}
          />
        ),
      }),
    ],
    [t, navigate, deletePassage, isDeleting],
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
      ariaLabel="Passages table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
