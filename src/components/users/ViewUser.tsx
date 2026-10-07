import { Avatar, Button, Chip } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Gender } from '@/types/common';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { useGetUserById } from '@/hooks/apis/users';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatDateTime } from '@/utils/datetime';

import AuditItem from '../shared/AuditItem';
import GenderChip from '../shared/GenderChip';
import Loader from '../shared/Loader';

type ViewUserProps = {
  id: string;
};

const ViewUser = ({ id }: ViewUserProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetUserById(id);

  if (isLoading) {
    return (
      <div className="flex h-[360px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      <div className="border-default-200 bg-default-50/60 flex items-center gap-4 rounded-xl border p-5">
        <Avatar
          className="size-14 shrink-0 rounded-2xl text-lg"
          color="accent"
          variant="soft"
        >
          <Avatar.Image alt={fullName} src={user.avatar} />
          <Avatar.Fallback className="rounded-2xl text-lg font-semibold">
            {initials || '?'}
          </Avatar.Fallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-default-900 truncate text-base font-semibold">
            {fullName || t('cmsUsers.form.email')}
          </p>
          <p className="text-default-500 truncate text-sm">{user.email}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {user.role?.name && (
            <Chip size="sm" variant="soft" color="accent">
              <Chip.Label>{user.role.name}</Chip.Label>
            </Chip>
          )}
          <Chip
            color={user.emailVerified ? 'success' : 'default'}
            size="sm"
            variant="soft"
          >
            <Chip.Label>
              {user.emailVerified
                ? t('common.verified')
                : t('common.unverified')}
            </Chip.Label>
          </Chip>
        </div>
      </div>

      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('cmsUsers.form.firstName')}>
          {user.firstName ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.lastName')}>
          {user.lastName ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.phone')}>
          {user.phone ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.dateOfBirth')}>
          {formatDateTime(user.dateOfBirth) ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.gender')}>
          {user.gender ? <GenderChip gender={user.gender as Gender} /> : null}
        </DetailField>
        <DetailField label={t('cmsUsers.form.role')}>
          {user.role?.name ?? ''}
        </DetailField>
        <DetailField label={t('cmsUsers.form.address')} span="full">
          {user.address ?? ''}
        </DetailField>
      </InfoCard>

      <InfoCard title={t('common.audit')}>
        <DetailField label={t('common.createdBy')}>
          <AuditItem
            user={user.auditMetadata?.createdBy}
            dateTime={user.auditMetadata?.createdAt}
          />
        </DetailField>
        <DetailField label={t('common.updatedBy')}>
          <AuditItem
            user={user.auditMetadata?.updatedBy}
            dateTime={user.auditMetadata?.updatedAt}
          />
        </DetailField>
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/users')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Users}
          variant="primary"
          onPress={() => navigate(`/users/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

export default ViewUser;
