import { Accordion, Button, Chip, Spinner } from '@heroui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPencil } from 'react-icons/lu';
import { useNavigate } from 'react-router';

import type { Permission } from '@/types/permission';

import MyButton from '@/components/shared/Button';
import DetailField, { InfoCard } from '@/components/shared/DetailField';
import { useGetPermissions } from '@/hooks/apis/permissions';
import { useGetRoleById } from '@/hooks/apis/roles';
import { PermissionAction, SubjectName } from '@/types/auth';
import { RoleStatus } from '@/types/role';

import Loader from '../shared/Loader';

type ViewRoleProps = {
  id: string;
};

const statusColorMap: Record<RoleStatus, 'success' | 'danger' | 'default'> = {
  [RoleStatus.ACTIVE]: 'success',
  [RoleStatus.INACTIVE]: 'danger',
  [RoleStatus.DELETED]: 'default',
};

type GroupedPermissions = Record<string, Permission[]>;

const groupPermission = (permissions?: Permission[]): GroupedPermissions => {
  if (!permissions) return {};
  return permissions.reduce((acc, permission) => {
    const { subject } = permission;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(permission);
    return acc;
  }, {} as GroupedPermissions);
};

const ViewRole = ({ id }: ViewRoleProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: role, isLoading } = useGetRoleById(id);
  const { data: allPermissions } = useGetPermissions();

  const permissionGroups = useMemo(() => {
    const groups = groupPermission(allPermissions);
    return groups;
  }, [allPermissions]);

  const rolePermissionIds = useMemo(() => {
    if (!role || !allPermissions) return new Set<number>();
    const matched = allPermissions.filter((p) =>
      role.permissions.some(
        (rp) => rp.action === p.action && rp.subject === p.subject,
      ),
    );
    return new Set(matched.map((p) => p.id));
  }, [role, allPermissions]);

  if (isLoading) {
    return (
      <div className="flex h-90 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!role) return null;

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title={t('common.basicInfo')}>
        <DetailField label={t('roles.form.name')}>{role.name}</DetailField>
        <DetailField label={t('roles.form.code')}>
          <span className="text-sm">{role.code}</span>
        </DetailField>
        <DetailField label={t('roles.form.status')}>
          <Chip color={statusColorMap[role.status]} size="sm" variant="soft">
            <Chip.Label>{role.status}</Chip.Label>
          </Chip>
        </DetailField>
        <DetailField label={t('roles.form.canAccessCms')}>
          <Chip
            color={role.canAccessCms ? 'success' : 'default'}
            size="sm"
            variant="soft"
          >
            <Chip.Label>
              {role.canAccessCms ? t('common.yes') : t('common.no')}
            </Chip.Label>
          </Chip>
        </DetailField>
      </InfoCard>

      <InfoCard title={t('roles.form.permissions')} columns={1}>
        {!allPermissions ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <Accordion allowsMultipleExpanded className="w-full">
            {Object.entries(permissionGroups).map(([subject, perms]) => {
              const selectedCount = perms.filter((p) =>
                rolePermissionIds.has(p.id),
              ).length;
              if (selectedCount === 0) return null;
              return (
                <Accordion.Item key={subject} id={subject}>
                  <Accordion.Heading>
                    <Accordion.Trigger className="flex w-full items-center gap-2 py-2.5">
                      <span className="text-default-800 min-w-0 flex-1 text-start text-sm font-medium capitalize">
                        {subject.replaceAll('_', ' ')}
                      </span>
                      <Chip size="sm" variant="soft">
                        <Chip.Label>
                          {selectedCount}/{perms.length}
                        </Chip.Label>
                      </Chip>
                      <Accordion.Indicator />
                    </Accordion.Trigger>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    <Accordion.Body className="flex flex-wrap gap-1.5 pb-3 pl-2">
                      {perms
                        .filter((p) => rolePermissionIds.has(p.id))
                        .map((p) => (
                          <Chip
                            key={p.id}
                            size="sm"
                            variant="soft"
                            color="success"
                          >
                            <Chip.Label className="capitalize">
                              {p.action}
                            </Chip.Label>
                          </Chip>
                        ))}
                    </Accordion.Body>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </InfoCard>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onPress={() => navigate('/roles')}>
          {t('common.back')}
        </Button>
        <MyButton
          I={PermissionAction.Update}
          a={SubjectName.Roles}
          variant="primary"
          onPress={() => navigate(`/roles/${id}/edit`)}
        >
          <LuPencil className="size-4" />
          {t('common.edit')}
        </MyButton>
      </div>
    </div>
  );
};

export default ViewRole;
