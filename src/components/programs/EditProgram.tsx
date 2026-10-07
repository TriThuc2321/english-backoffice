import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditProgramFormData } from '@/schemas/program';

import { useEditProgram, useGetProgramById } from '@/hooks/apis/programs';
import useCreateEditProgramForm from '@/hooks/forms/useCreateEditProgram';
import { ProgramStatus } from '@/types/program';

import ProgramForm from './ProgramForm';
import ProgramSkeleton from './Skeleton';

type EditProgramProps = {
  id: string;
};

const EditProgram = ({ id }: EditProgramProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editProgram, isPending: isEditing } = useEditProgram();
  const { data: programData, isLoading } = useGetProgramById(id);

  const form = useCreateEditProgramForm({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      status: ProgramStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (!programData) return;
    form.reset({
      code: programData.code ?? '',
      name: programData.name ?? '',
      description: programData.description ?? '',
      status: programData.status,
    });
  }, [programData, form]);

  const onSubmit = async (payload: CreateEditProgramFormData) => {
    try {
      await editProgram({
        id,
        ...payload,
        description: payload.description || undefined,
      });
      navigate('/programs');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <ProgramSkeleton />;

  return (
    <ProgramForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      onCancel={() => navigate('/programs')}
    />
  );
};

export default EditProgram;
