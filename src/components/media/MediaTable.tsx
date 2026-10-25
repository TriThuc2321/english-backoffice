import { Button, Chip, Dropdown } from '@heroui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEllipsisVertical, LuEye, LuTrash2 } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router';

import type { Media } from '@/types/media';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import FooterTable from '@/components/shared/table/FooterTable';
import TanstackTable from '@/components/shared/table/TanstackTable';
import { useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import { useDeleteMedia } from '@/hooks/apis/media';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatBytes, mediaFileName } from '@/utils/media';

import { kindColorMap, ownerHref, scopeColorMap } from './constants';
import MediaPreview from './MediaPreview';

const columnHelper = createColumnHelper<Media>();

type MediaActionsCellProps = {
  row: { original: Media };
  navigate: ReturnType<typeof useNavigate>;
  deleteMedia: (id: number) => void;
  isDeleting: boolean;
  t: ReturnType<typeof useTranslation>['t'];
};

function MediaActionsCell({
  row,
  navigate,
  deleteMedia,
  isDeleting,
  t,
}: MediaActionsCellProps) {
  const ability = useCan();
  const media = row.original;
  const deleteDescription = t('media.deleteConfirm', {
    name: mediaFileName(media.storageKey),
  });

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 md:flex">
        <MyButton
          I={PermissionAction.Read}
          a={SubjectName.Media}
          isIconOnly
          size="sm"
          variant="outline"
          onPress={() => navigate(`/media/${media.id}`)}
        >
          <LuEye className="size-4" />
        </MyButton>
        <ConfirmWrapper
          I={PermissionAction.Delete}
          a={SubjectName.Media}
          title={t('media.deleteTitle')}
          description={deleteDescription}
          onConfirm={() => deleteMedia(media.id)}
        >
          <MyButton
            I={PermissionAction.Delete}
            a={SubjectName.Media}
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
              {ability.can(PermissionAction.Read, SubjectName.Media) && (
                <Dropdown.Item
                  id="view"
                  textValue={t('common.view')}
                  onPress={() => navigate(`/media/${media.id}`)}
                >
                  <span className="flex items-center gap-2">
                    <LuEye className="size-4" />
                    {t('common.view')}
                  </span>
                </Dropdown.Item>
              )}
              {ability.can(PermissionAction.Delete, SubjectName.Media) && (
                <Dropdown.Item
                  id="delete"
                  textValue={t('common.delete')}
                  className="text-danger"
                  isDisabled={isDeleting}
                >
                  <ConfirmWrapper
                    title={t('media.deleteTitle')}
                    description={deleteDescription}
                    onConfirm={() => deleteMedia(media.id)}
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

interface MediaTableProps {
  data: Media[];
  isLoading?: boolean;
  page?: number;
  take?: number;
  total?: number;
}

export default function MediaTable({
  data,
  isLoading,
  page,
  take,
  total,
}: MediaTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'preview',
        header: t('media.field.preview'),
        cell: ({ row }) => <MediaPreview media={row.original} size="thumb" />,
      }),
      columnHelper.accessor('storageKey', {
        enableSorting: false,
        header: t('media.field.name'),
        cell: (info) => (
          <span className="block max-w-56 truncate font-mono text-xs">
            {mediaFileName(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('kind', {
        enableSorting: false,
        header: t('media.field.kind'),
        cell: (info) => (
          <Chip color={kindColorMap[info.getValue()]} size="sm" variant="soft">
            <Chip.Label>{t(`media.kind.${info.getValue()}`)}</Chip.Label>
          </Chip>
        ),
      }),
      columnHelper.accessor('scope', {
        enableSorting: false,
        header: t('media.field.scope'),
        cell: (info) => (
          <Chip color={scopeColorMap[info.getValue()]} size="sm" variant="soft">
            <Chip.Label>{t(`media.scope.${info.getValue()}`)}</Chip.Label>
          </Chip>
        ),
      }),
      columnHelper.accessor('ownerId', {
        enableSorting: false,
        header: t('media.field.owner'),
        cell: ({ row }) => {
          const { scope, ownerId } = row.original;
          // Library media has no owner
          if (!ownerId) return '-';
          return (
            <Link
              to={ownerHref(scope, ownerId)}
              className="text-accent block max-w-32 truncate text-sm hover:underline"
            >
              {ownerId}
            </Link>
          );
        },
      }),
      columnHelper.accessor('sizeBytes', {
        enableSorting: false,
        header: t('media.field.size'),
        cell: (info) => formatBytes(info.getValue()),
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
          <MediaActionsCell
            row={row}
            navigate={navigate}
            deleteMedia={deleteMedia}
            isDeleting={isDeleting}
            t={t}
          />
        ),
      }),
    ],
    [t, navigate, deleteMedia, isDeleting],
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
      ariaLabel="Media table"
      isLoading={isLoading}
      footer={<FooterTable page={page} take={take} total={total} />}
    />
  );
}
