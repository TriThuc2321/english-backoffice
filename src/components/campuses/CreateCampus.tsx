import { useNavigate } from 'react-router';

import type { CreateEditCampusFormData } from '@/schemas/campus';

import { useCreateCampus } from '@/hooks/apis/campuses';
import useCreateEditCampusForm from '@/hooks/forms/useCreateEditCampus';
import { CampusStatus } from '@/types/campus';

import CampusForm from './CampusForm';

const CreateCampus = () => {
  const navigate = useNavigate();
  const { mutateAsync: createCampus, isPending: isCreating } =
    useCreateCampus();

  const form = useCreateEditCampusForm({
    defaultValues: {
      code: '',
      name: '',
      address: '',
      phone: '',
      status: CampusStatus.ACTIVE,
    },
  });

  const onSubmit = async (payload: CreateEditCampusFormData) => {
    try {
      await createCampus({
        ...payload,
        address: payload.address || undefined,
        phone: payload.phone || undefined,
      });
      navigate('/campuses');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CampusForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/campuses')}
    />
  );
};

export default CreateCampus;
