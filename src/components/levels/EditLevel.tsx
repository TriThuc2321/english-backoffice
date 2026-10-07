import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditLevelFormData } from '@/schemas/level';

import { useEditLevel, useGetLevelById } from '@/hooks/apis/levels';
import useCreateEditLevelForm from '@/hooks/forms/useCreateEditLevel';
import { LevelStatus } from '@/types/level';

import LevelForm from './LevelForm';

type EditLevelProps = {
  levelId: string;
  programId: string;
};

const EditLevel = ({ levelId, programId }: EditLevelProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editLevel, isPending: isEditing } = useEditLevel();
  const { data: levelData, isLoading } = useGetLevelById(levelId);

  const form = useCreateEditLevelForm({
    defaultValues: {
      code: '',
      name: '',
      displayOrder: 0,
      status: LevelStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (!levelData) return;
    form.reset({
      code: levelData.code ?? '',
      name: levelData.name ?? '',
      displayOrder: levelData.displayOrder ?? 0,
      ageMin: levelData.ageMin ?? null,
      ageMax: levelData.ageMax ?? null,
      status: levelData.status,
    });
  }, [levelData, form]);

  const onSubmit = async (payload: CreateEditLevelFormData) => {
    try {
      await editLevel({
        id: levelId,
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

  if (isLoading) return null;

  return (
    <LevelForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      onCancel={() => navigate(`/programs/${programId}`)}
    />
  );
};

export default EditLevel;
