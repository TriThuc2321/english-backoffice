import { useNavigate } from 'react-router';

import type { CreateEditLevelFormData } from '@/schemas/level';

import { useCreateLevel } from '@/hooks/apis/levels';
import useCreateEditLevelForm from '@/hooks/forms/useCreateEditLevel';
import { LevelStatus } from '@/types/level';

import LevelForm from './LevelForm';

type CreateLevelProps = {
  programId: string;
};

const CreateLevel = ({ programId }: CreateLevelProps) => {
  const navigate = useNavigate();
  const { mutateAsync: createLevel, isPending: isCreating } = useCreateLevel();

  const form = useCreateEditLevelForm({
    defaultValues: {
      code: '',
      name: '',
      displayOrder: 0,
      status: LevelStatus.ACTIVE,
    },
  });

  const onSubmit = async (payload: CreateEditLevelFormData) => {
    try {
      await createLevel({
        programId,
        code: payload.code,
        name: payload.name,
        displayOrder: payload.displayOrder,
        ageMin: payload.ageMin ?? undefined,
        ageMax: payload.ageMax ?? undefined,
        status: payload.status,
      });
      navigate(`/programs/${programId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LevelForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate(`/programs/${programId}`)}
    />
  );
};

export default CreateLevel;
