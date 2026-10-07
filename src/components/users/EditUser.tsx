import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditUserFormData } from '@/schemas/user';

import { useEditUser, useGetUserById } from '@/hooks/apis/users';
import useCreateEditUserForm from '@/hooks/forms/useCreateEditUser';

import UserSkeleton from './Skeleton';
import UserForm from './UserForm';

type EditUserProps = {
  id: string;
};

const EditUser = ({ id }: EditUserProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editUser, isPending: isEditing } = useEditUser();
  const { data: userData, isLoading } = useGetUserById(id);

  const form = useCreateEditUserForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      avatar: '',
      phone: '',
      dateOfBirth: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!userData) return;
    form.reset({
      email: userData.email ?? '',
      firstName: userData.firstName ?? '',
      lastName: userData.lastName ?? '',
      avatar: userData.avatar ?? '',
      roleId: userData.role?.id,
      phone: userData.phone ?? '',
      dateOfBirth: userData.dateOfBirth ?? '',
      gender: userData.gender,
      address: userData.address ?? '',
    });
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: CreateEditUserFormData) => {
    try {
      const { roleId, ...rest } = data;
      await editUser({ id, roleId: roleId!, ...rest });
      navigate(`/users/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <UserSkeleton />;
  }

  return (
    <UserForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      onCancel={() => navigate('/users')}
      isEditing
    />
  );
};

export default EditUser;
