import { Button, Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuFileText, LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import AuditItem from '@/components/shared/AuditItem';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { Can } from '@/configs/casl/can.config';
import { useEditPassage, useGetPassageById } from '@/hooks/apis/passages';
import { PermissionAction, SubjectName } from '@/types/auth';
import { MarkedBy, Status } from '@/types/common';

import { statusColorMap } from './constants';
import MarkedByChip from './MarkedByChip';
import PassageSkeleton from './Skeleton';

type ViewPassageProps = {
  id: string;
};

const getParagraphPrefix = (index: number, markedBy?: MarkedBy) => {
  if (markedBy === MarkedBy.ALPHABET) {
    return `${String.fromCharCode(65 + index)}.`;
  }

  if (markedBy === MarkedBy.NUMBER) {
    return `${index + 1}.`;
  }

  return '';
};

const ViewPassage = ({ id }: ViewPassageProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: passage, isLoading } = useGetPassageById(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useEditPassage();

  if (isLoading) return <PassageSkeleton />;

  if (!passage) return null;

  const audit = passage.auditMetadata;
  const isPublished = passage.status === Status.PUBLISHED;

  const statusChip = passage.status ? (
    <Chip color={statusColorMap[passage.status]} size="sm" variant="soft">
      <Chip.Label>{passage.status}</Chip.Label>
    </Chip>
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="bg-accent-soft text-accent-soft-foreground flex size-14 shrink-0 items-center justify-center rounded-2xl">
            <LuFileText className="size-6" />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 className="truncate text-xl font-semibold">
                {passage.title || '-'}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {statusChip}
              {passage.markedBy && <MarkedByChip markedBy={passage.markedBy} />}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => navigate('/passages')}
          >
            <LuArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
          <Can I={PermissionAction.Update} a={SubjectName.Passages}>
            <Button
              size="sm"
              variant={isPublished ? 'danger-soft' : 'outline'}
              isPending={isUpdatingStatus}
              onPress={() =>
                updateStatus({
                  id,
                  status: isPublished ? Status.DRAFT : Status.PUBLISHED,
                })
              }
            >
              {isPublished
                ? t('passages.form.unpublish')
                : t('passages.form.publish')}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onPress={() => navigate(`/passages/${id}/edit`)}
            >
              <LuPencil className="size-4" />
              {t('common.edit')}
            </Button>
          </Can>
        </div>
      </header>

      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('passages.form.title')} span="full">
          {passage.title || '-'}
        </DetailField>
        <DetailField label={t('passages.form.subtitle')} span="full">
          {passage.subtitle || '-'}
        </DetailField>
        <DetailField label={t('passages.form.markedBy.label')}>
          {passage.markedBy ? (
            <MarkedByChip markedBy={passage.markedBy} />
          ) : (
            '-'
          )}
        </DetailField>
        <DetailField label={t('passages.form.status')}>
          {statusChip ?? '-'}
        </DetailField>
      </InfoCard>

      {!!passage.paragraphs?.length && (
        <InfoCard title={t('passages.form.paragraphs')} columns={1}>
          <div className="flex flex-col gap-3">
            {passage.paragraphs.map(({ id, content }, index) => (
              <p
                key={id}
                className="text-default-800 text-justify text-sm leading-relaxed"
              >
                <span className="font-semibold">
                  {getParagraphPrefix(index, passage.markedBy)}{' '}
                </span>
                {content}
              </p>
            ))}
          </div>
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

export default ViewPassage;
