import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { GradingQueueItem } from '@/types/grading';

import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { PermissionAction, SubjectName } from '@/types/auth';
import { GradingStatus } from '@/types/grading';
import { formatPersonName } from '@/utils/common';
import { formatDateTime } from '@/utils/datetime';

import GradingStatusChip from './GradingStatusChip';

const columnHelper = createColumnHelper<GradingQueueItem>();

type GradingQueueTableProps = {
  data: GradingQueueItem[];
  isLoading?: boolean;
  page: number;
  take: number;
  total: number;
};

const GradingQueueTable = ({
  data,
  isLoading,
  page,
  take,
  total,
}: GradingQueueTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor('student', {
        header: t('grading.field.student'),
        cell: ({ getValue }) => {
          const student = getValue();
          return (
            <div className="flex flex-col">
              <span className="font-medium">{formatPersonName(student)}</span>
              {student.email && (
                <span className="text-muted text-xs">{student.email}</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('test', {
        header: t('grading.field.test'),
        cell: ({ getValue }) => {
          const test = getValue();
          return (
            <div className="flex flex-col">
              <span>{test.title}</span>
              <span className="text-muted text-xs">
                {t(`tests.examType.${test.examType}`)}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('skill', {
        header: t('grading.field.skill'),
        cell: ({ getValue }) => t(`tests.skill.${getValue()}`),
      }),
      columnHelper.accessor('submittedAt', {
        header: t('grading.field.submittedAt'),
        cell: ({ getValue }) =>
          formatDateTime(getValue() ?? undefined, 'DD/MM/YYYY HH:mm'),
      }),
      columnHelper.accessor('gradingStatus', {
        header: t('grading.field.status'),
        cell: ({ getValue }) => <GradingStatusChip status={getValue()} />,
      }),
      columnHelper.accessor('band', {
        header: t('grading.field.band'),
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('grader', {
        header: t('grading.field.grader'),
        cell: ({ getValue }) => {
          const grader = getValue();
          return grader ? formatPersonName(grader) : '—';
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <MyButton
            I={PermissionAction.Read}
            a={SubjectName.Assessments}
            size="sm"
            variant="outline"
            onPress={() =>
              navigate(`/grading/${row.original.attemptSectionId}`)
            }
          >
            {row.original.gradingStatus === GradingStatus.PENDING
              ? t('grading.action.grade')
              : t('grading.action.view')}
          </MyButton>
        ),
      }),
    ],
    [t, navigate],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    initialState: { columnPinning: { right: ['actions'] } },
  });

  return (
    <TanstackTable
      table={table}
      ariaLabel="Grading queue"
      isLoading={isLoading}
      emptyContent={t('grading.empty')}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
};

export default GradingQueueTable;
