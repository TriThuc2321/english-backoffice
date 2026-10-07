import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditCampusFormData } from '@/schemas/campus';

import { useEditCampus, useGetCampusById } from '@/hooks/apis/campuses';
import useCreateEditCampusForm from '@/hooks/forms/useCreateEditCampus';
import { CampusStatus } from '@/types/campus';

import CampusForm from './CampusForm';
import CampusSkeleton from './Skeleton';

type EditCampusProps = {
  id: string;
};

const EditCampus = ({ id }: EditCampusProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editCampus, isPending: isEditing } = useEditCampus();
  const { data: campusData, isLoading } = useGetCampusById(id);

  const form = useCreateEditCampusForm({
    defaultValues: {
      code: '',
      name: '',
      address: '',
      phone: '',
      status: CampusStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (!campusData) return;
    form.reset({
      code: campusData.code ?? '',
      name: campusData.name ?? '',
      address: campusData.address ?? '',
      phone: campusData.phone ?? '',
      status: campusData.status,
    });
  }, [campusData, form]);

  const onSubmit = async (payload: CreateEditCampusFormData) => {
    try {
      await editCampus({
        id,
        ...payload,
        address: payload.address || undefined,
        phone: payload.phone || undefined,
      });
      navigate('/campuses');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <CampusSkeleton />;

  return (
    <CampusForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      onCancel={() => navigate('/campuses')}
    />
  );
};

export default EditCampus;
