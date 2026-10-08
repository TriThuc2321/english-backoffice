import { Avatar, Button, Chip, toast } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft, LuCopy, LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Gender } from '@/types/common';

import AuditItem from '@/components/shared/AuditItem';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import GenderChip from '@/components/shared/GenderChip';
import Loader from '@/components/shared/Loader';
import { Can } from '@/configs/casl/can.config';
import { useGetUserById } from '@/hooks/apis/users';
import { PermissionAction, SubjectName } from '@/types/auth';
import { formatDateTime } from '@/utils/datetime';

type ViewUserProps = {
  id: string;
};

const ViewUser = ({ id }: ViewUserProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetUserById(id);

  if (isLoading) {
    return (
      <div className="flex h-90 items-center justify-center">
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

  const copyEmail = async () => {
    if (!user.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      toast.success(t('common.copied'));
    } catch {
      // Clipboard can be blocked (insecure context / permissions)
    }
  };

  const audit = user.auditMetadata;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
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

          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <h2 className="truncate text-xl font-semibold">
                {fullName || user.email}
              </h2>
              {user.email && (
                <div className="text-muted flex items-center gap-1">
                  <span className="truncate text-sm">{user.email}</span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    aria-label={t('common.copy')}
                    className="size-6 min-w-6"
                    onPress={copyEmail}
                  >
                    <LuCopy className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {user.role?.name && (
                <Chip color="accent" size="sm" variant="soft">
                  <Chip.Label>{user.role.name}</Chip.Label>
                </Chip>
              )}
              <Chip
                color={user.isActive ? 'success' : 'default'}
                size="sm"
                variant="soft"
              >
                <Chip.Label>
                  {user.isActive ? t('common.active') : t('common.inactive')}
                </Chip.Label>
              </Chip>
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
              {user.systemUser && (
                <Chip color="accent" size="sm" variant="soft">
                  <Chip.Label>{t('cmsUsers.system')}</Chip.Label>
                </Chip>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => navigate('/users')}
          >
            <LuArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
          <Can I={PermissionAction.Update} a={SubjectName.Users}>
            <Button
              size="sm"
              variant="primary"
              onPress={() => navigate(`/users/${id}/edit`)}
            >
              <LuPencil className="size-4" />
              {t('common.edit')}
            </Button>
          </Can>
        </div>
      </header>

      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('cmsUsers.form.firstName')}>
          {user.firstName || '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.lastName')}>
          {user.lastName || '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.phone')}>
          {user.phone || '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.dateOfBirth')}>
          {formatDateTime(user.dateOfBirth) || '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.gender')}>
          {user.gender ? <GenderChip gender={user.gender as Gender} /> : '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.role')}>
          {user.role?.name || '-'}
        </DetailField>
        <DetailField label={t('cmsUsers.form.address')} span="full">
          {user.address || '-'}
        </DetailField>
      </InfoCard>

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

export default ViewUser;
