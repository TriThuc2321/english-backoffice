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
import { LuEllipsisVertical, LuLock, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Test } from '@/types/test';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteTest } from '@/hooks/apis/tests';
import { PermissionAction, SubjectName } from '@/types/auth';
import { toSortDescriptor, toSortingState } from '@/utils/table';

import { statusColorMap } from './constants';

const columnHelper = createColumnHelper<Test>();

type TestActionsCellProps = {
  row: { original: Test };
  navigate: ReturnType<typeof useNavigate>;
  deleteTest: (ids: number[]) => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function TestActionsCell({
  row,
  navigate,
  deleteTest,
  isDeleting,
  t,
}: TestActionsCellProps) {
  const ability = useCan();

  const handleDelete = () => {
    deleteTest([row.original.id]);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Tests}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/tests/${row.original.id}/edit`)}
        >
          <LuPencil className="size-4" />
        </MyButton>
        <ConfirmWrapper
          I={PermissionAction.Delete}
          a={SubjectName.Tests}
          title={t('tests.deleteTitle')}
          description={t('tests.deleteConfirm', {
            name: row.original.title,
          })}
          onConfirm={handleDelete}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Tests}
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
          <Button isIconOnly size="sm" variant="tertiary">
            <LuEllipsisVertical className="size-4" />
          </Button>
          <Dropdown.Popover placement="left">
            <Dropdown.Menu aria-label={t('common.actions')}>
              {ability.can(PermissionAction.Update, SubjectName.Tests) && (
                <Dropdown.Item
                  id="edit"
                  textValue={t('common.edit')}
                  onPress={() => navigate(`/tests/${row.original.id}/edit`)}
                >
                  <span className="flex items-center gap-2">
                    <LuPencil className="size-4" />
                    {t('common.edit')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Tests) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('tests.deleteTitle')}
                    description={t('tests.deleteConfirm', {
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

interface TestsTableProps {
  data: Test[];
  isLoading?: boolean;
  page?: number;
  take?: number;
  total?: number;
}

export default function TestsTable({
  data,
  isLoading,
  page,
  take,
  total,
}: TestsTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteTest, isPending: isDeleting } = useDeleteTest();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        enableSorting: false,
        header: t('tests.table.title'),
        cell: (info) => (
          <span className="flex items-center gap-1.5">
            {info.getValue()}
            {info.row.original.lockedAt && (
              <LuLock
                className="text-muted size-3.5"
                aria-label={t('tests.locked')}
              />
            )}
          </span>
        ),
      }),
      columnHelper.accessor('examType', {
        enableSorting: false,
        header: t('tests.table.examType'),
        cell: (info) => (
          <Chip color="accent" size="sm" variant="soft">
            <Chip.Label>{t(`tests.examType.${info.getValue()}`)}</Chip.Label>
          </Chip>
        ),
      }),
      columnHelper.accessor('source', {
        enableSorting: false,
        header: t('tests.table.source'),
        cell: (info) => info.getValue() || '-',
      }),
      columnHelper.accessor('durationMinutes', {
        enableSorting: false,
        header: t('tests.table.durationMin'),
        cell: (info) => {
          const value = info.getValue();
          return value ? t('tests.minutesShort', { count: value }) : '-';
        },
      }),
      columnHelper.accessor('status', {
        enableSorting: false,
        header: t('tests.table.publishStatus'),
        cell: (info) => {
          const value = info.getValue();
          if (!value) return '-';
          return (
            <Chip color={statusColorMap[value]} size="sm" variant="soft">
              <Chip.Label>{t(`tests.status.${value}`)}</Chip.Label>
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
          <TestActionsCell
            row={row}
            navigate={navigate}
            deleteTest={deleteTest}
            isDeleting={isDeleting}
            t={t}
          />
        ),
      }),
    ],
    [t, navigate, deleteTest, isDeleting],
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
      ariaLabel="Tests table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
