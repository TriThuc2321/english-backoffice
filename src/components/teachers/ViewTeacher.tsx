import { Avatar, Button, Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { useGetTeacherById } from '@/hooks/apis/teachers';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatDateTime } from '@/utils/datetime';

import AuditItem from '../shared/AuditItem';
import TeacherSkeleton from './Skeleton';

type ViewTeacherProps = {
  id: string;
};

const ViewTeacher = ({ id }: ViewTeacherProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: teacher, isLoading } = useGetTeacherById(id);

  if (isLoading) return <TeacherSkeleton />;
  if (!teacher) return null;

  const fullName = [teacher.user?.firstName, teacher.user?.lastName]
    .filter(Boolean)
    .join(' ');

  const initials = [teacher.user?.firstName, teacher.user?.lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-default-50/60 flex items-center gap-4 rounded-xl border p-5">
        <Avatar
          className="size-16 shrink-0 rounded-2xl"
          color="accent"
          variant="soft"
        >
          <Avatar.Image
            alt={fullName}
            src={teacher.user?.avatar ?? undefined}
          />
          <Avatar.Fallback className="rounded-2xl text-xl font-semibold">
            {initials || '?'}
          </Avatar.Fallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-default-900 text-base font-semibold">
            {fullName || '-'}
          </p>
          <p className="text-default-500 mt-0.5 text-sm">
            {teacher.user?.email ?? '-'}
          </p>
          <p className="text-default-400 font-mono text-xs">{teacher.code}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {teacher.nationality && (
            <Chip size="sm" variant="soft">
              <Chip.Label>{teacher.nationality}</Chip.Label>
            </Chip>
          )}
        </div>
      </div>

      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('cmsUsers.form.email')}>
          {teacher.user?.email ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.phone')}>
          {teacher.user?.phone ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.dateOfBirth')}>
          {formatDateTime(teacher.user?.dateOfBirth ?? undefined) ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.gender')}>
          {teacher.user?.gender ?? ''}
        </DetailField>
        <DetailField label={t('teachers.table.nationality')}>
          {teacher.nationality ?? ''}
        </DetailField>
        <DetailField label={t('teachers.table.code')}>
          <span className="font-mono text-sm">{teacher.code ?? ''}</span>
        </DetailField>
        <DetailField label={t('cmsUsers.form.address')} span="full">
          {teacher.user?.address ?? ''}
        </DetailField>
      </InfoCard>

      {!!teacher?.skills?.length && (
        <InfoCard columns={1} title={t('teachers.form.skills')}>
          <div className="flex flex-col gap-2">
            {teacher.skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3 p-2">
                <span className="text-default-800 text-sm font-semibold">
                  {skill.level}
                </span>
                {skill.skillArea && (
                  <>
                    <span className="text-default-300">·</span>
                    <span className="text-default-600 text-sm">
                      {skill.skillArea}
                    </span>
                  </>
                )}
                {skill.targetAudience && (
                  <>
                    <span className="text-default-300">·</span>
                    <span className="text-default-500 text-sm">
                      {skill.targetAudience}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      {teacher?.certificates?.length > 0 && (
        <InfoCard columns={1} title={t('teachers.form.certificates')}>
          <div className="flex flex-col gap-2">
            {teacher.certificates.map((cert) => (
              <div key={cert.id} className="p-2">
                <p className="text-sm font-semibold">{cert.name}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {cert.issuer && (
                    <span className="text-default-500 text-sm">
                      {cert.issuer}
                    </span>
                  )}
                  {cert.score && (
                    <span className="text-default-500 text-sm">
                      {t('teachers.form.certScore')}: {cert.score}
                    </span>
                  )}
                  {cert.issueDate && (
                    <span className="text-default-500 text-sm">
                      {t('teachers.form.certIssueDate')}:{' '}
                      {formatDateTime(cert.issueDate)}
                    </span>
                  )}
                  {cert.expiryDate && (
                    <span className="text-default-500 text-sm">
                      {t('teachers.form.certExpiryDate')}:{' '}
                      {formatDateTime(cert.expiryDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      )}

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          <AuditItem
            user={teacher.auditMetadata?.createdBy}
            dateTime={teacher.auditMetadata?.createdAt}
          />
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          <AuditItem
            user={teacher.auditMetadata?.updatedBy}
            dateTime={teacher.auditMetadata?.updatedAt}
          />
        </DetailField>
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/teachers')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Teachers}
          variant="primary"
          onPress={() => navigate(`/teachers/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

export default ViewTeacher;
