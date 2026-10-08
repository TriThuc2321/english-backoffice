import { useNavigate } from 'react-router';

import type { CreateEditPassageFormData } from '@/schemas/passage';
import type { CreatePassagePayload } from '@/types/passage';

import { useCreatePassage } from '@/hooks/apis/passages';
import useCreateEditPassageForm from '@/hooks/forms/useCreateEditPassage';
import { MarkedBy } from '@/types/common';

import PassageForm from './PassageForm';

const CreatePassage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPassage, isPending: isCreating } =
    useCreatePassage();

  const form = useCreateEditPassageForm({
    defaultValues: {
      title: '',
      subtitle: '',
      markedBy: MarkedBy.NONE,
      paragraphs: [],
    },
  });

  const onSubmit = async (payload: CreateEditPassageFormData) => {
    try {
      const passage = await createPassage(payload as CreatePassagePayload);
      navigate(passage?.id ? `/passages/${passage.id}` : '/passages');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PassageForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isCreating}
      onCancel={() => navigate('/passages')}
    />
  );
};

export default CreatePassage;
