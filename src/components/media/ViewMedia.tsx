import { Button, Chip, buttonVariants } from '@heroui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  LuArrowLeft,
  LuAudioLines,
  LuExternalLink,
  LuImage,
  LuTrash2,
} from 'react-icons/lu';
import { Link, useNavigate } from 'react-router';

import type { EditMediaFormData } from '@/schemas/media';

import AuditItem from '@/components/shared/AuditItem';
import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { NumberInput, TextInput } from '@/components/tests/editor/fields';
import { Can, useCan } from '@/configs/casl/can.config';
import ConfirmWrapper from '@/configs/ConfirmWrapper';
import {
  useDeleteMedia,
  useEditMedia,
  useGetMediaById,
} from '@/hooks/apis/media';
import { useEditMediaForm } from '@/hooks/forms';
import { PermissionAction, SubjectName } from '@/types/auth';
import { MediaKind } from '@/types/test';
import { formatBytes, formatDuration, mediaFileName } from '@/utils/media';

import { kindColorMap, ownerHref, scopeColorMap } from './constants';
import MediaPreview from './MediaPreview';
import MediaSkeleton from './Skeleton';

type ViewMediaProps = {
  id: number;
};

const ViewMedia = ({ id }: ViewMediaProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ability = useCan();
  const canUpdate = ability.can(PermissionAction.Update, SubjectName.Media);

  const { data: media, isLoading } = useGetMediaById(id);
  const { mutateAsync: editMedia, isPending: isEditing } = useEditMedia();
  const { mutateAsync: deleteMedia, isPending: isDeleting } = useDeleteMedia();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useEditMediaForm({ defaultValues: { transcript: '' } });

  useEffect(() => {
    if (!media) return;
    reset({
      durationMs: media.durationMs ?? undefined,
      transcript: media.transcript ?? '',
    });
  }, [media, reset]);

  if (isLoading) return <MediaSkeleton />;

  if (!media) return null;

  const audit = media.auditMetadata;
  const name = mediaFileName(media.storageKey);
  const isAudio = media.kind === MediaKind.AUDIO;

  const onSubmit = async (data: EditMediaFormData) => {
    try {
      await editMedia({
        id,
        durationMs: data.durationMs ?? null,
        transcript: data.transcript.trim() || null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await deleteMedia(id);
      navigate('/media');
    } catch (error) {
      // 409 while still attached; the hook already shows the reason
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="bg-accent-soft text-accent-soft-foreground rounded-field flex size-14 shrink-0 items-center justify-center">
            {isAudio ? (
              <LuAudioLines className="size-6" />
            ) : (
              <LuImage className="size-6" />
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="truncate font-mono text-lg font-semibold">{name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Chip color={kindColorMap[media.kind]} size="sm" variant="soft">
                <Chip.Label>{t(`media.kind.${media.kind}`)}</Chip.Label>
              </Chip>
              <Chip color={scopeColorMap[media.scope]} size="sm" variant="soft">
                <Chip.Label>{t(`media.scope.${media.scope}`)}</Chip.Label>
              </Chip>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => navigate('/media')}
          >
            <LuArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
          <a
            href={media.url}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
          >
            <LuExternalLink className="size-4" />
            {t('media.openFile')}
          </a>
          <ConfirmWrapper
            I={PermissionAction.Delete}
            a={SubjectName.Media}
            title={t('media.deleteTitle')}
            description={t('media.deleteConfirm', { name })}
            onConfirm={onDelete}
          >
            <MyButton
              I={PermissionAction.Delete}
              a={SubjectName.Media}
              size="sm"
              variant="danger-soft"
              isPending={isDeleting}
            >
              <LuTrash2 className="size-4" />
              {t('common.delete')}
            </MyButton>
          </ConfirmWrapper>
        </div>
      </header>

      <MediaPreview media={media} />

      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('media.field.id')}>#{media.id}</DetailField>
        <DetailField label={t('media.field.owner')}>
          {media.ownerId ? (
            <Link
              to={ownerHref(media.scope, media.ownerId)}
              className="text-accent break-all hover:underline"
            >
              {media.ownerId}
            </Link>
          ) : (
            '-'
          )}
        </DetailField>
        <DetailField label={t('media.field.mimeType')}>
          {media.mimeType ?? '-'}
        </DetailField>
        <DetailField label={t('media.field.size')}>
          {formatBytes(media.sizeBytes)}
        </DetailField>
        {isAudio && (
          <DetailField label={t('media.field.duration')}>
            {media.durationMs != null ? formatDuration(media.durationMs) : '-'}
          </DetailField>
        )}
        <DetailField label={t('media.field.storageKey')} span="full">
          <span className="font-mono text-xs break-all">
            {media.storageKey}
          </span>
        </DetailField>
      </InfoCard>

      {isAudio && (
        <InfoCard
          title={t('media.metadata')}
          description={t('media.metadataDescription')}
          columns={1}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="durationMs"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label={t('media.field.durationMs')}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.durationMs?.message}
                  isDisabled={!canUpdate}
                />
              )}
            />
            <Controller
              name="transcript"
              control={control}
              render={({ field }) => (
                <TextInput
                  multiline
                  rows={8}
                  label={t('media.field.transcript')}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.transcript?.message}
                  isDisabled={!canUpdate}
                />
              )}
            />
            <Can I={PermissionAction.Update} a={SubjectName.Media}>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isPending={isEditing}
                  isDisabled={!isDirty}
                >
                  {t('common.save')}
                </Button>
              </div>
            </Can>
          </form>
        </InfoCard>
      )}

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          {audit?.createdBy || audit?.createdAt ? (
            <AuditItem user={audit.createdBy} dateTime={audit.createdAt} />
          ) : (
            '-'
          )}
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          {audit?.updatedBy || audit?.updatedAt ? (
            <AuditItem user={audit.updatedBy} dateTime={audit.updatedAt} />
          ) : (
            '-'
          )}
        </DetailField>
      </InfoCard>
    </div>
  );
};

export default ViewMedia;
