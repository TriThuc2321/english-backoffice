import { useNavigate } from 'react-router';

import type { CreateEditUserFormData } from '@/schemas/user';

import { useCreateUser } from '@/hooks/apis/users';
import useCreateEditUserForm from '@/hooks/forms/useCreateEditUser';

import UserForm from './UserForm';

const CreateUser = () => {
  const navigate = useNavigate();
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();

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

  const onSubmit = async (payload: CreateEditUserFormData) => {
    try {
      const newUser = await createUser(payload);
      navigate(`/users/${newUser.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/users')}
    />
  );
};

export default CreateUser;
