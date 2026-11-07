import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { StudentAttemptItem } from '@/types/attempt';

import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { AttemptStatus } from '@/types/attempt';
import { PermissionAction, SubjectName } from '@/types/auth';
import { GradingStatus } from '@/types/grading';
import { isIelts } from '@/utils/attemptResult';
import { formatPersonName } from '@/utils/common';
import { formatDateTime } from '@/utils/datetime';

import AttemptStatusChip from './AttemptStatusChip';

const columnHelper = createColumnHelper<StudentAttemptItem>();

type AttemptsTableProps = {
  data: StudentAttemptItem[];
  isLoading?: boolean;
  page: number;
  take: number;
  total: number;
};

const AttemptsTable = ({
  data,
  isLoading,
  page,
  take,
  total,
}: AttemptsTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      columnHelper.accessor('student', {
        header: t('attempts.field.student'),
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
        header: t('attempts.field.test'),
        cell: ({ getValue, row }) => {
          const test = getValue();
          return (
            <div className="flex flex-col">
              <span>{test.title}</span>
              <span className="text-muted text-xs">
                {t(`tests.examType.${test.examType}`)} ·{' '}
                {t(`attempts.mode.${row.original.mode}`)}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('sections', {
        header: t('attempts.field.sections'),
        cell: ({ getValue, row }) => {
          const ielts = isIelts(row.original.test.examType);
          return (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {[...getValue()]
                .sort((a, b) => a.order - b.order)
                .map((s) => (
                  <span key={s.id} className="whitespace-nowrap">
                    <span className="text-muted">
                      {t(`tests.skill.${s.skill}`)}
                    </span>{' '}
                    <strong className="tabular-nums">
                      {s.scaledScore === null
                        ? s.gradingStatus === GradingStatus.PENDING
                          ? '…'
                          : '—'
                        : ielts
                          ? s.scaledScore.toFixed(1)
                          : s.scaledScore}
                    </strong>
                  </span>
                ))}
            </div>
          );
        },
      }),
      columnHelper.accessor('overallScore', {
        header: t('attempts.field.overall'),
        cell: ({ getValue, row }) => {
          const score = getValue();
          if (score === null) return '—';
          return (
            <strong className="tabular-nums">
              {isIelts(row.original.test.examType) ? score.toFixed(1) : score}
            </strong>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: t('attempts.field.status'),
        cell: ({ getValue }) => <AttemptStatusChip status={getValue()} />,
      }),
      columnHelper.accessor('startedAt', {
        header: t('attempts.field.startedAt'),
        cell: ({ getValue }) => formatDateTime(getValue(), 'DD/MM/YYYY HH:mm'),
      }),
      columnHelper.accessor('submittedAt', {
        header: t('attempts.field.submittedAt'),
        cell: ({ getValue }) =>
          formatDateTime(getValue() ?? undefined, 'DD/MM/YYYY HH:mm'),
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
            isDisabled={row.original.status === AttemptStatus.IN_PROGRESS}
            onPress={() => navigate(`/attempts/${row.original.id}`)}
          >
            {t('attempts.action.viewResult')}
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
      ariaLabel="Student attempts"
      isLoading={isLoading}
      emptyContent={t('attempts.empty')}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
};

export default AttemptsTable;
