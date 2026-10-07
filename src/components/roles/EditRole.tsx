import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditRoleFormData } from '@/schemas/role';

import { useGetPermissions } from '@/hooks/apis/permissions';
import { useEditRole, useGetRoleById } from '@/hooks/apis/roles';
import useCreateEditRoleForm from '@/hooks/forms/useCreateEditRole';
import { RoleStatus } from '@/types/role';

import RoleForm from './RoleForm';
import RoleSkeleton from './Skeleton';

type EditRoleProps = {
  id: string;
};

const EditRole = ({ id }: EditRoleProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editRole, isPending: isEditing } = useEditRole();

  const { data: roleData, isLoading: isLoadingRole } = useGetRoleById(id);
  const { data: allPermissions } = useGetPermissions();

  const form = useCreateEditRoleForm({
    defaultValues: {
      name: '',
      code: '',
      status: RoleStatus.ACTIVE,
      canAccessCms: false,
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (!roleData || !allPermissions) return;
    const mappedIds = allPermissions
      .filter((p) =>
        roleData.permissions.some(
          (rp) => rp.action === p.action && rp.subject === p.subject,
        ),
      )
      .map((p) => p.id);
    form.reset({
      name: roleData.name,
      code: roleData.code,
      status: roleData.status,
      canAccessCms: roleData.canAccessCms,
      permissionIds: mappedIds,
    });
  }, [roleData, allPermissions]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (payload: CreateEditRoleFormData) => {
    try {
      await editRole({ id, ...payload });
      navigate('/roles');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingRole) {
    return <RoleSkeleton />;
  }

  return (
    <RoleForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      onCancel={() => navigate('/roles')}
    />
  );
};

export default EditRole;
