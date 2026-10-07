import { Button } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { useGetCampusById } from '@/hooks/apis/campuses';
import { PermissionAction, SubjectName } from '@/types/auth';

import AuditItem from '../shared/AuditItem';
import CampusSkeleton from './Skeleton';

type ViewCampusProps = {
  id: string;
};

const ViewCampus = ({ id }: ViewCampusProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: campus, isLoading } = useGetCampusById(id);

  if (isLoading) return <CampusSkeleton />;
  if (!campus) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-default-50/60 flex items-center gap-4 rounded-xl border p-5">
        <div className="min-w-0 flex-1">
          <p className="text-default-900 text-base font-semibold">
            {campus.name || '-'}
          </p>
          <p className="text-default-400 font-mono text-xs">{campus.code}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2"></div>
      </div>

      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('campuses.form.code')}>
          <span className="font-mono text-sm">{campus.code ?? ''}</span>
        </DetailField>
        <DetailField label={t('campuses.form.name')}>
          {campus.name ?? ''}
        </DetailField>
        <DetailField label={t('campuses.form.phone')}>
          {campus.phone ?? ''}
        </DetailField>
        <DetailField label={t('campuses.form.address')} span="full">
          {campus.address ?? ''}
        </DetailField>
      </InfoCard>

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          <AuditItem
            user={campus.auditMetadata?.createdBy}
            dateTime={campus.auditMetadata?.createdAt}
          />
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          <AuditItem
            user={campus.auditMetadata?.updatedBy}
            dateTime={campus.auditMetadata?.updatedAt}
          />
        </DetailField>
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/campuses')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Campuses}
          variant="primary"
          onPress={() => navigate(`/campuses/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

export default ViewCampus;
