import { useNavigate } from 'react-router';

import type { CreateEditProgramFormData } from '@/schemas/program';

import { useCreateProgram } from '@/hooks/apis/programs';
import useCreateEditProgramForm from '@/hooks/forms/useCreateEditProgram';
import { ProgramStatus } from '@/types/program';

import ProgramForm from './ProgramForm';

const CreateProgram = () => {
  const navigate = useNavigate();
  const { mutateAsync: createProgram, isPending: isCreating } =
    useCreateProgram();

  const form = useCreateEditProgramForm({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      status: ProgramStatus.ACTIVE,
    },
  });

  const onSubmit = async (payload: CreateEditProgramFormData) => {
    try {
      await createProgram({
        ...payload,
        description: payload.description || undefined,
      });
      navigate('/programs');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProgramForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/programs')}
    />
  );
};

export default CreateProgram;
