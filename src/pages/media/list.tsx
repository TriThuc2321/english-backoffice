import { Card, Input, Label, TextField } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuUpload } from 'react-icons/lu';
import { useSearchParams, type MetaFunction } from 'react-router';

import { MediaTable, UploadMediaModal } from '@/components/media';
import MyButton from '@/components/shared/Button';
import FilterSelect from '@/components/shared/FilterSelect';
import { useDebounce } from '@/hooks';
import { useGetMediaList } from '@/hooks/apis/media';
import { PermissionAction, SubjectName } from '@/types/auth';
import { MediaScope } from '@/types/media';
import { MediaKind } from '@/types/test';
import { pageMeta } from '@/utils/metadata';

export const meta: MetaFunction = () =>
  pageMeta(
    'Media',
    'Browse, preview and manage audio and image files uploaded to MyEnglish.',
  );

const ALL = 'ALL';

const SCOPES = Object.values(MediaScope);
const KINDS = Object.values(MediaKind);

export default function MediaPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const page = Number(searchParams.get('page') ?? 1);
  const take = Number(searchParams.get('take') ?? 10);
  const ownerIdParam = searchParams.get('ownerId') ?? '';
  const scope = SCOPES.find((v) => v === searchParams.get('scope'));
  const kind = KINDS.find((v) => v === searchParams.get('kind'));

  const [ownerId, setOwnerId] = useState(ownerIdParam);
  const debouncedOwnerId = useDebounce(ownerId, 500);

  useEffect(() => {
    const next = debouncedOwnerId.trim();
    if (next === ownerIdParam) return;
    setSearchParams((prev) => {
      if (next) prev.set('ownerId', next);
      else prev.delete('ownerId');
      prev.set('page', '1');
      return prev;
    });
  }, [debouncedOwnerId, ownerIdParam, setSearchParams]);

  const { data, isLoading } = useGetMediaList(
    { page, take, scope, kind, ownerId: ownerIdParam || undefined },
    { enabled: true },
  );

  const media = data?.data ?? [];
  const total = data?.meta?.totalCount ?? 0;

  const setFilter = (name: 'scope' | 'kind', value: string) =>
    setSearchParams((prev) => {
      if (value === ALL) prev.delete(name);
      else prev.set(name, value);
      prev.set('page', '1');
      return prev;
    });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <Card.Header className="flex-col justify-between gap-3 md:flex-row md:items-end">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <FilterSelect
              label={t('media.field.scope')}
              value={scope ?? ALL}
              onChange={(value) => setFilter('scope', value)}
              options={[
                { id: ALL, label: t('media.filters.all') },
                ...SCOPES.map((v) => ({ id: v, label: t(`media.scope.${v}`) })),
              ]}
            />

            <FilterSelect
              label={t('media.field.kind')}
              value={kind ?? ALL}
              onChange={(value) => setFilter('kind', value)}
              options={[
                { id: ALL, label: t('media.filters.all') },
                ...KINDS.map((v) => ({ id: v, label: t(`media.kind.${v}`) })),
              ]}
            />

            <TextField
              value={ownerId}
              onChange={setOwnerId}
              aria-label="Filter by owner"
            >
              <Label>{t('media.field.owner')}</Label>
              <Input
                className="ml-0.5 md:w-64"
                placeholder={t('media.ownerIdPlaceholder')}
              />
            </TextField>
          </div>

          <MyButton
            className="self-end"
            I={PermissionAction.Create}
            a={SubjectName.Media}
            variant="primary"
            onPress={() => setIsUploadOpen(true)}
          >
            <LuUpload className="size-4" />
            {t('media.uploadButton')}
          </MyButton>
        </Card.Header>

        <Card.Content className="p-0">
          <MediaTable
            data={media}
            isLoading={isLoading}
            page={page}
            take={take}
            total={total}
          />
        </Card.Content>
      </Card>

      <UploadMediaModal isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </div>
  );
}
