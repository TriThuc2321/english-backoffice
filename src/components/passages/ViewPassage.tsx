import { Button, Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { useGetPassageById } from '@/hooks/apis/passages';
import { PermissionAction, SubjectName } from '@/types/auth';
import { MarkedBy } from '@/types/common';

import AuditItem from '../shared/AuditItem';
import { statusColorMap } from './constants';
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

  if (isLoading) return <PassageSkeleton />;

  if (!passage) return null;

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('passages.form.title')}>
          {passage.title ?? ''}
        </DetailField>
        <DetailField label={t('passages.form.subtitle')}>
          {passage.subtitle ?? ''}
        </DetailField>
        <DetailField label={t('passages.form.markedBy.label')}>
          {passage.markedBy ?? ''}
        </DetailField>
        <DetailField label={t('passages.form.status')}>
          {passage.status ? (
            <Chip
              color={statusColorMap[passage.status]}
              size="sm"
              variant="soft"
            >
              <Chip.Label>{passage.status}</Chip.Label>
            </Chip>
          ) : null}
        </DetailField>
      </InfoCard>

      {!!passage?.paragraphs?.length && (
        <InfoCard title={t('passages.form.paragraphs')} columns={1}>
          <div className="flex flex-col">
            {passage.paragraphs.map(({ id, content }, index) => (
              <div
                key={id}
                className="flex gap-3 rounded-lg px-4 text-sm leading-relaxed"
              >
                <p className="text-default-800 text-justify">
                  <span>{getParagraphPrefix(index, passage.markedBy)} </span>
                  {content}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          <AuditItem
            user={passage.auditMetadata?.createdBy}
            dateTime={passage.auditMetadata?.createdAt}
          />
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          <AuditItem
            user={passage.auditMetadata?.updatedBy}
            dateTime={passage.auditMetadata?.updatedAt}
          />
        </DetailField>
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/passages')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Passages}
          variant="primary"
          onPress={() => navigate(`/passages/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

export default ViewPassage;
