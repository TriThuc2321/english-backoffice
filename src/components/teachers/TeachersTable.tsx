import { Avatar, Button, Chip, Dropdown } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEllipsisVertical, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Teacher } from '@/types/teacher';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteTeacher } from '@/hooks/apis/teachers';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatDateTime } from '@/utils/datetime';

import { skillAreaColorMap } from './constants';

const columnHelper = createColumnHelper<Teacher>();

type TeacherActionsCellProps = {
  row: { original: Teacher };
  navigate: ReturnType<typeof useNavigate>;
  deleteTeacher: (ids: string[]) => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function TeacherActionsCell({
  row,
  navigate,
  deleteTeacher,
  isDeleting,
  t,
}: TeacherActionsCellProps) {
  const ability = useCan();

  const handleDelete = () => {
    deleteTeacher([row.original.id]);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Read}
          a={SubjectName.Teachers}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/teachers/${row.original.id}`)}
        >
          <LuEye className="size-4" />
        </MyButton>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Teachers}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/teachers/${row.original.id}/edit`)}
        >
          <LuPencil className="size-4" />
        </MyButton>
        <ConfirmWrapper
          title={t('teachers.deleteTitle')}
          description={t('teachers.deleteConfirm', { name: row.original.code })}
          onConfirm={handleDelete}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Teachers}
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
              {ability.can(PermissionAction.Read, SubjectName.Teachers) && (
                <Dropdown.Item
                  id="view"
                  textValue={t('common.view')}
                  onPress={() => navigate(`/teachers/${row.original.id}`)}
                >
                  <span className="flex items-center gap-2">
                    <LuEye className="size-4" />
                    {t('common.view')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Update, SubjectName.Teachers) && (
                <Dropdown.Item
                  id="edit"
                  textValue={t('common.edit')}
                  onPress={() => navigate(`/teachers/${row.original.id}/edit`)}
                >
                  <span className="flex items-center gap-2">
                    <LuPencil className="size-4" />
                    {t('common.edit')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Teachers) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('teachers.deleteTitle')}
                    description={t('teachers.deleteConfirm', {
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

interface TeachersTableProps {
  data: Teacher[];
  isLoading?: boolean;
  page?: number;
  take?: number;
  total?: number;
}

export default function TeachersTable({
  data,
  isLoading,
  page,
  take,
  total,
}: TeachersTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher();

  const columns = useMemo(
    () => [
      columnHelper.accessor('code', {
        enableSorting: false,
        header: t('teachers.table.code'),
      }),
      columnHelper.accessor('user', {
        enableSorting: false,
        id: 'name',
        header: t('teachers.table.name'),
        cell: (info) => {
          const user = info.getValue();
          if (!user) return '-';
          const fullName = [user.firstName, user.lastName]
            .filter(Boolean)
            .join(' ');
          const firstInitial = user.firstName?.charAt(0) ?? '';
          const lastInitial = user.lastName?.charAt(0) ?? '';
          const fallbackInitials = (
            firstInitial + lastInitial || 'ME'
          ).toUpperCase();
          const fallbackName = fullName || user.email || 'MyEnglish Teacher';
          return (
            <div className="flex gap-2">
              <Avatar className="rounded-2xl" variant="soft" color="accent">
                <Avatar.Image
                  alt={fallbackName}
                  src={user.avatar ?? undefined}
                />
                <Avatar.Fallback className="rounded-2xl">
                  {fallbackInitials}
                </Avatar.Fallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{fallbackName}</p>
                <p className="text-xs text-gray-500">{user.email ?? ''}</p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('user', {
        enableSorting: false,
        id: 'phone',
        header: t('teachers.table.phone'),
        cell: (info) => info.getValue()?.phone ?? '-',
      }),
      columnHelper.accessor('user', {
        enableSorting: false,
        id: 'dateOfBirth',
        header: t('teachers.table.dateOfBirth'),
        cell: (info) =>
          formatDateTime(info.getValue()?.dateOfBirth ?? undefined),
      }),
      columnHelper.accessor('skills', {
        enableSorting: false,
        header: t('teachers.table.skills'),
        cell: (info) => {
          const skills = info.getValue();
          if (!skills?.length) return '-';
          return (
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <Chip
                  key={skill.id}
                  color={
                    skill.skillArea
                      ? skillAreaColorMap[skill.skillArea]
                      : 'default'
                  }
                  size="sm"
                  variant="soft"
                >
                  <Chip.Label>
                    {[skill.skillArea, skill.level, skill.targetAudience]
                      .filter(Boolean)
                      .join(' · ')}
                  </Chip.Label>
                </Chip>
              ))}
            </div>
          );
        },
      }),
      columnHelper.accessor('certificates', {
        enableSorting: false,
        header: t('teachers.table.certificates'),
        cell: (info) => {
          const certs = info.getValue();
          if (!certs?.length) return '-';
          return (
            <div className="flex flex-col gap-0.5">
              {certs.map((cert) => (
                <span key={cert.id} className="text-sm">
                  {[cert.name, cert.score].filter(Boolean).join(' - ')}
                </span>
              ))}
            </div>
          );
        },
      }),
      columnHelper.accessor('nationality', {
        enableSorting: false,
        header: t('teachers.table.nationality'),
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
          <TeacherActionsCell
            row={row}
            navigate={navigate}
            deleteTeacher={deleteTeacher}
            isDeleting={isDeleting}
            t={t}
          />
        ),
      }),
    ],
    [t, navigate, deleteTeacher, isDeleting],
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
      ariaLabel="Teachers table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
