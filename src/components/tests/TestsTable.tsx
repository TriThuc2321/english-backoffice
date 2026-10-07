import { Button, Chip, Dropdown } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEllipsisVertical, LuPencil, LuTrash2 } from 'react-icons/lu';
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

import {
  publishStatusColorMap,
  skillColorMap,
  testTypeColorMap,
} from './constants';

const columnHelper = createColumnHelper<Test>();

type TestActionsCellProps = {
  row: { original: Test };
  navigate: ReturnType<typeof useNavigate>;
  deleteTest: (ids: string[]) => void;
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
          title={t('tests.deleteTitle')}
          description={t('tests.deleteConfirm', { name: row.original.code })}
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

      <div className="md:hidden">
        <Dropdown>
          <Dropdown.Trigger>
            <Button isIconOnly size="sm" variant="tertiary">
              <LuEllipsisVertical className="size-4" />
            </Button>
          </Dropdown.Trigger>
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

  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        enableSorting: false,
        header: t('tests.table.code'),
        cell: (info) => (
          <span className="font-mono text-sm">{info.getValue() ?? '-'}</span>
        ),
      }),
      columnHelper.accessor('title', {
        enableSorting: false,
        header: t('tests.table.title'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('skill', {
        enableSorting: false,
        header: t('tests.table.skill'),
        cell: (info) => {
          const skill = info.getValue();
          if (!skill) return '-';
          return (
            <Chip size="sm" variant="soft" color={skillColorMap[skill]}>
              <Chip.Label>{skill}</Chip.Label>
            </Chip>
          );
        },
      }),
      columnHelper.accessor('type', {
        enableSorting: false,
        header: t('tests.table.type'),
        cell: (info) => {
          const type = info.getValue();
          if (!type) return '-';
          return (
            <Chip size="sm" variant="soft" color={testTypeColorMap[type]}>
              <Chip.Label>{type}</Chip.Label>
            </Chip>
          );
        },
      }),
      columnHelper.accessor('publishStatus', {
        enableSorting: false,
        header: t('tests.table.publishStatus'),
        cell: (info) => {
          const status = info.getValue();
          if (!status) return '-';
          return (
            <Chip
              size="sm"
              variant="soft"
              color={publishStatusColorMap[status]}
            >
              <Chip.Label>{status}</Chip.Label>
            </Chip>
          );
        },
      }),
      columnHelper.accessor('durationMin', {
        enableSorting: false,
        header: t('tests.table.durationMin'),
        cell: (info) => {
          const val = info.getValue();
          return val != null ? `${val} min` : '-';
        },
      }),
      columnHelper.accessor('totalQuestions', {
        enableSorting: false,
        header: t('tests.table.totalQuestions'),
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('attempts', {
        enableSorting: false,
        header: t('tests.table.attempts'),
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
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
  });

  return (
    <TanstackTable
      table={table}
      ariaLabel="Tests table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
