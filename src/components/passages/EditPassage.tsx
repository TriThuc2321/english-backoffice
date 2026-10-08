import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import type { CreateEditPassageFormData } from '@/schemas/passage';

import { useEditPassage, useGetPassageById } from '@/hooks/apis/passages';
import useCreateEditPassageForm from '@/hooks/forms/useCreateEditPassage';
import { MarkedBy } from '@/types/common';
import { PassageStatus } from '@/types/passage';

import PassageForm from './PassageForm';
import PassageSkeleton from './Skeleton';

type EditPassageProps = {
  id: string;
};

const EditPassage = ({ id }: EditPassageProps) => {
  const navigate = useNavigate();
  const { mutateAsync: editPassage, isPending: isEditing } = useEditPassage();
  const { mutateAsync: updatePassageStatus, isPending: isUpdatingStatus } =
    useEditPassage();

  const { data: passageData, isLoading } = useGetPassageById(id);

  const form = useCreateEditPassageForm({
    defaultValues: {
      title: '',
      subtitle: '',
      status: PassageStatus.DRAFT,
      markedBy: MarkedBy.NONE,
      paragraphs: [],
    },
  });

  useEffect(() => {
    if (!passageData) return;
    form.reset({
      title: passageData.title ?? '',
      subtitle: passageData.subtitle ?? '',
      markedBy: passageData.markedBy,
      status:
        passageData.status === PassageStatus.PUBLISHED
          ? PassageStatus.PUBLISHED
          : PassageStatus.DRAFT,
      paragraphs:
        passageData.paragraphs?.map((p) => ({ content: p.content ?? '' })) ??
        [],
    });
  }, [passageData]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (payload: CreateEditPassageFormData) => {
    try {
      await editPassage({ id, ...payload });
      navigate(`/passages/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <PassageSkeleton />;
  }

  return (
    <PassageForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isEditing}
      onStatusChange={(status) => updatePassageStatus({ id, status })}
      isStatusSubmitting={isUpdatingStatus}
      onCancel={() => navigate('/passages')}
    />
  );
};

export default EditPassage;
