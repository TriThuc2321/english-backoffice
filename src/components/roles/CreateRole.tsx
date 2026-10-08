import { useNavigate } from 'react-router';

import type { CreateEditRoleFormData } from '@/schemas/role';
import type { CreateRolePayload } from '@/types/role';

import { useCreateRole } from '@/hooks/apis/roles';
import useCreateEditRoleForm from '@/hooks/forms/useCreateEditRole';

import RoleForm from './RoleForm';

const CreateRole = () => {
  const navigate = useNavigate();
  const { mutateAsync: createRole, isPending: isCreating } = useCreateRole();

  const form = useCreateEditRoleForm({
    defaultValues: {
      name: '',
      code: '',
      canAccessCms: false,
      permissionIds: [],
    },
  });

  const onSubmit = async (payload: CreateEditRoleFormData) => {
    try {
      await createRole(payload as CreateRolePayload);
      navigate('/roles');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RoleForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/roles')}
    />
  );
};

export default CreateRole;
