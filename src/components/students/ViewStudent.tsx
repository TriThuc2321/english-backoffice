import { Button, Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { useGetStudentById } from '@/hooks/apis/students';
import { PermissionAction, SubjectName } from '@/types/auth';
import { StudentSegment } from '@/types/student';
import { formatDateTime } from '@/utils/datetime';

import AuditItem from '../shared/AuditItem';
import { segmentColorMap } from './constants';
import StudentSkeleton from './Skeleton';

type ViewStudentProps = {
  id: string;
};

const ViewStudent = ({ id }: ViewStudentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: student, isLoading } = useGetStudentById(id);

  if (isLoading) return <StudentSkeleton />;
  if (!student) return null;

  const isKidSegment =
    student.segment === StudentSegment.KIDS ||
    student.segment === StudentSegment.TEENS;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-default-50/60 flex items-center gap-4 rounded-xl border p-5">
        <div className="min-w-0 flex-1">
          <p className="text-default-900 text-base font-semibold">
            {[student.user.firstName, student.user.lastName]
              .filter(Boolean)
              .join(' ') || '-'}
          </p>
          <p className="text-default-500 mt-0.5 text-sm">
            {student.user.email ?? student.user.phone ?? '-'}
          </p>
          <p className="text-default-400 font-mono text-xs">
            {student.studentCode}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {student.segment && (
            <Chip
              color={segmentColorMap[student.segment]}
              size="sm"
              variant="soft"
            >
              <Chip.Label>{student.segment}</Chip.Label>
            </Chip>
          )}
        </div>
      </div>

      <InfoCard title={t('students.form.basicInfo')}>
        <DetailField label={t('students.table.studentCode')}>
          <span className="font-mono text-sm">{student.studentCode}</span>
        </DetailField>
        <DetailField label={t('students.table.segment')}>
          {student.segment}
        </DetailField>
        <DetailField label={t('students.table.entryLevel')}>
          {student.entryLevelCode ?? '-'}
        </DetailField>
      </InfoCard>

      <InfoCard title={t('students.form.contactInfo')}>
        <DetailField label={t('students.table.email')}>
          {student.user.email ?? '-'}
        </DetailField>
        <DetailField label={t('students.table.phone')}>
          {student.user.phone ?? '-'}
        </DetailField>
        <DetailField label={t('students.table.dob')}>
          {formatDateTime(student.user.dateOfBirth ?? undefined) ?? '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.gender')}>
          {student.user.gender ?? '-'}
        </DetailField>
        {student.note && (
          <DetailField label={t('students.form.note')} span="full">
            {student.note}
          </DetailField>
        )}
      </InfoCard>

      {isKidSegment && (
        <InfoCard title={t('students.form.parentInfo')}>
          <DetailField label={t('students.form.parentName')}>
            {student.parentName ?? '-'}
          </DetailField>
          <DetailField label={t('students.form.parentPhone')}>
            {student.parentPhone ?? '-'}
          </DetailField>
          <DetailField label={t('students.form.parentEmail')}>
            {student.parentEmail ?? '-'}
          </DetailField>
          <DetailField label={t('students.form.parentRelationship')}>
            {student.parentRelationship ?? '-'}
          </DetailField>
        </InfoCard>
      )}

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          <AuditItem
            user={student.auditMetadata?.createdBy}
            dateTime={student.auditMetadata?.createdAt}
          />
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          <AuditItem
            user={student.auditMetadata?.updatedBy}
            dateTime={student.auditMetadata?.updatedAt}
          />
        </DetailField>
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/students')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Students}
          variant="primary"
          onPress={() => navigate(`/students/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

export default ViewStudent;
